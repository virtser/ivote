class ConnectController < ApplicationController

  # GET /user/1.json
  def user
    unless params[:fb_id].nil?
      @user = User.find_by(fb_id: params[:fb_id])
      render json: @user.id, status: :ok
    end
  end

  # POST /connect
  # POST /connect.json
  def create
    unless params[:token].nil?
      tracker = Generic.get_mixpanel_tracker

      # Get more data on user from Facebook
      fb_user = FbGraph2::User.me(params[:token]).fetch
      # logger.info "FB my user details: " + fb_user.to_yaml

      # Initialize Syream client with your api key and secret
      client = Generic.get_streams_client

      # Get user details
      @user = User.find_by(fb_id: fb_user.id)
      # logger.info @user.to_yaml

      # Check if user not registered yet
      if @user.nil?

        # Register user
        @user = User.new(fb_id: fb_user.id, first_name: fb_user.first_name, last_name: fb_user.last_name, email: fb_user.email, device_token: params[:device_token])

        if @user.save
          logger.info  "REGISTER USER!"
          tracker.track(@user.id, 'Registered')

          # Instantiate Stream user feed object
          my_user_feed = client.feed('user', @user.id)
          my_flat_feed = client.feed('flat', @user.id)

          # Get user friends Facebook IDs
          fb_friends_ids = []
          fb_user.friends.each do |u|
            fb_friends_ids.push(u.id)
          end

          # Get user friends IDs
          friends_ids = User.where("fb_id IN (?)", fb_friends_ids).pluck(:id)
          friends_of_friends = Hash.new 

          # Get friends of friends IDs
          if friends_ids.length > 0
            friends_of_friends = Relation.where(user_id: friends_ids).pluck(:friend_user_id)
          end

          follow_user = []                    
          follow_friendsof_user = []                    

          # Save user friends 
          # TODO: Change to BULK INSERT
          friends_ids.each do |f_id|
            @relation = Relation.new(user_id: @user.id, friend_user_id: f_id)
            @relation.save

            @opposite_relation = Relation.new(user_id: f_id, friend_user_id: @user.id)
            @opposite_relation.save

            follow_user.push({:source => 'flat:' + @user.id.to_s, :target => 'user:' + f_id.to_s})
            follow_user.push({:source => 'flat:' + f_id.to_s, :target => 'user:' + @user.id.to_s})

            # Add friends of friends
            friends_of_friends.each do |ff_id|
              follow_friendsof_user.push({:source => 'flat:' + @user.id.to_s, :target => 'user:' + ff_id.to_s})
              follow_friendsof_user.push({:source => 'flat:' + ff_id.to_s, :target => 'user:' + @user.id.to_s})
            end

            logger.info 'SAVING RELATIONS!'
          end

          # Follow Stream of friend
          if follow_user.length > 0
            begin 
              logger.info "Follow users: " + follow_user.to_yaml
              client.follow_many(follow_user)
              logger.info "Follow users success!"
            rescue Stream::StreamApiResponseException => e
              Rails.logger.error "A Stream error occurred: #{e.class} - #{e.message}"  
            end
          end

          # Follow Stream of friend of friends
          if follow_friendsof_user.length > 0
            begin 
              logger.info "Follow friends of users: " + follow_friendsof_user.to_yaml
              client.follow_many(follow_friendsof_user)
              logger.info "Follow friends of users success!"
            rescue Stream::StreamApiResponseException => e
              Rails.logger.error "A Stream error occurred: #{e.class} - #{e.message}"  
            end
          end

          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      else
        logger.info  "LOGIN USER!"   

        # Update user device token on login
        unless params[:device_token].nil?
          @user.update(device_token: params[:device_token])
          # logger.info  "Device token updated: " + params[:device_token]  
        end

        tracker.track(@user.id, 'Login')

        render json: @user, status: :ok
      end

    else
      logger.error  "ERROR!"
      render json: { message: "You provided an invalid token!" } , status: :forbidden 
    end
  end

  def resubs
    all_users = User.all
    Delayed::Job.enqueue ResubscribeJob.new(all_users)
  end

end

class ResubscribeJob < Struct.new(:users)
  def perform
    users.each do |user|

        logger.info "process " + user.to_yaml

        @friends = Relation.where(user_id: user.id).pluck(:friend_user_id)

        if @friends.length > 0
          friends_of_friends = Relation.where(user_id: @friends).pluck(:friend_user_id)

          if friends_of_friends.length > 0
            follow_friendsof_user = []
            friends_of_friends.each do |ff_id|
                follow_friendsof_user.push({:source => 'flat:' + user.id.to_s, :target => 'user:' + ff_id.to_s})
                follow_friendsof_user.push({:source => 'flat:' + ff_id.to_s, :target => 'user:' + user.id.to_s})
            end

            begin
              client = Generic.get_streams_client
              logger.info "Follow friends of users: " + follow_friendsof_user.to_yaml
              client.follow_many(follow_friendsof_user)
              logger.info "Follow friends of users success!"
            rescue Stream::StreamApiResponseException => e
              Rails.logger.error "A Stream error occurred: #{e.class} - #{e.message}"
            end
          else
            logger.info "no friends of friends"
          end
        else
          logger.info "USER has no friends :-("
        end

    end
  end
end
