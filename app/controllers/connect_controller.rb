class ConnectController < ApplicationController

  # POST /connect
  # POST /connect.json
  def create
    unless params[:token].nil?
      logger.info  "TOKEN RECEIVED!"

      # Get more data on user from Facebook
      fb_user = FbGraph2::User.me(params[:token]).fetch
      logger.info "FB User: " + fb_user.to_yaml
      logger.info "Friends: " + fb_user.friends.to_yaml

      # Get user details
      @user = User.find_by(fbuser_id: fb_user.id)

      # Check if user not registered yet
      if @user.nil?
        logger.info  "REGISTER USER!"

        # Register user
         @user = User.new(fbuser_id: fb_user.id, first_name: fb_user.first_name, last_name: fb_user.last_name)

        if @user.save
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
