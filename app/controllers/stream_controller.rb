require 'stream'
require 'mixpanel-ruby'

class StreamController < ApplicationController

  # POST /stream/post/1
  # POST /stream/post/1.json
  def post

  	unless params[:user_id].nil? && params[:text].nil?
  	  @user_id = params[:user_id]
  	  text = params[:text]

      logger.info "Post text: " + text.to_yaml

  	  # Initialize Stream client with your api key and secret
  	  @stream_client = Stream::Client.new('4xmc2pqg5hhm', 'p9x6e4jqvk2bft7trs85rzgms4dngsuw3e4tpqxpg9gksn6p49yx5p8r28c6s9tw')

  	  # Instantiate Stream user feed object
  	  @user_feed = @stream_client.feed('user', @user_id)

  	  # Add the activity to the Stream feed
    	activity_data = {:actor => @user_id, :verb => 'post', :object => 1, :post => text}
  	  activity_response = @user_feed.add_activity(activity_data)   

      tracker = Mixpanel::Tracker.new('5169a311c1cad013734458bb88005dcd')
      tracker.track(@user_id, 'Post')

      Generic.send_notificatioin(params[:user_id], 'חבר/ה שלך כתב/ה פוסט חדש באפליקציית iVote.')

      render json: activity_response, status: :ok
    else
      logger.error  "ERROR!"
      render json: { message: "You provided an invalid user_id!" } , status: :forbidden 
    end
  end

  # GET /stream/user/1
  # GET /stream/user/1.json
  def user
  	  @user_id = params[:user_id]

  	  # Initialize Stream client with your api key and secret
  	  @stream_client = Stream::Client.new('4xmc2pqg5hhm', 'p9x6e4jqvk2bft7trs85rzgms4dngsuw3e4tpqxpg9gksn6p49yx5p8r28c6s9tw')

  	  # Instantiate Stream user feed object
  	  @user_feed = @stream_client.feed('user', @user_id)
  	  # logger.info "Following feeds: " +	@user_feed.following(10).to_yaml

  		# Get User activities 
  	  result = @user_feed.get(:limit=>10)

  	  result["results"].each_with_index do |item, index|
  		  @user_party_id = Vote.where(user_id: item["actor"]).limit(1).pluck(:party_id)

  		  # Get user party
  		  @party_name = Party.where(id: @user_party_id).pluck(:name).first
  		  result["results"][index]["party"] = @party_name
  	  end

      render json: result["results"], status: :ok
  end

  # GET /stream/flat/1
  # GET /stream/flat/1.json
  def flat
  	  @user_id = params[:user_id]

  	  # Initialize Stream client with your api key and secret
  	  @stream_client = Stream::Client.new('4xmc2pqg5hhm', 'p9x6e4jqvk2bft7trs85rzgms4dngsuw3e4tpqxpg9gksn6p49yx5p8r28c6s9tw')

  	  # Instantiate Stream user feed object
  	  @user_feed = @stream_client.feed('flat', @user_id)

  	  # Get Flat activities 
  	  result = @user_feed.get(:limit=>10)

  	  result["results"].each_with_index do |item, index|
  		  @user_party_id = Vote.where(user_id: item["actor"]).limit(1).pluck(:party_id)

  		  # Get user party
  		  @party_name = Party.where(id: @user_party_id).pluck(:name).first
  		  result["results"][index]["party"] = @party_name
  	  end

      render json: result["results"], status: :ok
  end

end
