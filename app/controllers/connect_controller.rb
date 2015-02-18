class ConnectController < ApplicationController

  # POST /connect
  # POST /connect.json
  def create
    unless params[:token].nil?
      logger.info  "TOKEN RECEIVED!"

      # Get user details
      @user = User.find_by(token: params[:token])

      # Check if user not registered yet
      if @user.nil?

        # Get more data on user from Facebook
        fb_user = FbGraph::User.me(params[:token])
        logger.info "FB User:" + fb_user.to_yaml

        # Register user
         @user = User.new(token: params[:token], first_name: fb_user.first_name, last_name: fb_user.last_name, gender: fb_user.gender, email: fb_user.email)

        if @user.save
          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      else
        render json: { message:  "User already registered, logging in." }, status: :ok
      end

    else
      logger.error  "ERROR!"
      render json: { message: "You provided an invalid token!" } , status: :forbidden 
    end
  end

end
