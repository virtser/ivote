require 'stream'

class ConnectController < ApplicationController

  # POST /connect
  # POST /connect.json
  def create
    unless params[:token].nil?
      logger.info  "TOKEN RECEIVED!"

      # Get more data on user from Facebook
      @fb_user = FbGraph2::User.me(params[:token]).fetch

      # Initialize Syream client with your api key and secret
      @stream_client = Stream::Client.new('4xmc2pqg5hhm', 'p9x6e4jqvk2bft7trs85rzgms4dngsuw3e4tpqxpg9gksn6p49yx5p8r28c6s9tw')

      # Get user details
      @user = User.find_by(fbuser_id: @fb_user.id)

      # Check if user not registered yet
      if @user.nil?

        # Register user
        @user = User.new(fbuser_id: @fb_user.id, first_name: @fb_user.first_name, last_name: @fb_user.last_name)

        if @user.save
          logger.info  "REGISTER USER!"

          # Instantiate Stream user feed object
          @user_feed = @stream_client.feed('flat', @user.id)

          # Save user friends 
          @fb_user.friends.each do |u|
            @friend = User.find_by(fbuser_id: u.id)

            unless @friend.nil?
              @relation = Relation.new(user_id: @user.id, friend_user_id: @friend.id)
              @relation.save

              # Follow Stream of another feed
              @user_feed.follow('user', @friend.id)

              @opposite_relation = Relation.new(user_id: @friend.id, friend_user_id: @user.id)
              @opposite_relation.save

              # Instantiate Stream user feed object
              @user_feed = @stream_client.feed('flat', @friend.id)
              # Follow Stream of another feed
              @user_feed.follow('user', @user.id)

              logger.info 'SAVING RELATIONS!'
            end 

          end

          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      else
        logger.info  "LOGIN USER!"   
        render json: @user, status: :ok
      end

    else
      logger.error  "ERROR!"
      render json: { message: "You provided an invalid token!" } , status: :forbidden 
    end
  end

end
