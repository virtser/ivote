require 'stream'

class StreamController < ApplicationController

# POST /stream/post/1
# POST /stream/post/1.json
def post
	unless params[:user_id].nil? && params[:text].nil?
	  logger.info "GOT USER ID!"
	  logger.info "PARAMS: " + params.to_yaml

	  @user_id = params[:user_id]
	  @text = params[:text] # {"text": "bla bla bla"}

	  # Initialize Stream client with your api key and secret
	  @stream_client = Stream::Client.new('4xmc2pqg5hhm', 'p9x6e4jqvk2bft7trs85rzgms4dngsuw3e4tpqxpg9gksn6p49yx5p8r28c6s9tw')

	  # Instantiate Stream user feed object
	  @user_feed = @stream_client.feed('user', @user_id)
	  

	  # Add the activity to the Stream feed
  	  activity_data = {:actor => @user_id, :verb => 'post', :object => 1, :post => @text}
	  activity_response = @user_feed.add_activity(activity_data)      
      
      render json: activity_response, status: :ok
    else
      logger.error  "ERROR!"
      render json: { message: "You provided an invalid user_id!" } , status: :forbidden 
    end
end

end
