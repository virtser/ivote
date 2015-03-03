require 'stream'
require 'mandrill'

class StreamController < ApplicationController

# POST /stream/post/1
# POST /stream/post/1.json
def post
	unless params[:user_id].nil? && params[:text].nil?
	  logger.info "GOT USER ID!"
	  logger.info "PARAMS: " + params.to_yaml

	  @user_id = params[:user_id]
	  @text = params[:text] 

  	  # Initialize Stream client with your api key and secret
  	  @stream_client = Stream::Client.new('4xmc2pqg5hhm', 'p9x6e4jqvk2bft7trs85rzgms4dngsuw3e4tpqxpg9gksn6p49yx5p8r28c6s9tw')

	  # Instantiate Stream user feed object
	  @user_feed = @stream_client.feed('user', @user_id)

	  # Add the activity to the Stream feed
  	  activity_data = {:actor => @user_id, :verb => 'post', :object => 1, :post => @text}
	  activity_response = @user_feed.add_activity(activity_data)   

	  send_mail

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

   def send_mail
      user_id = params[:user_id].to_s

      friends = Relation.where(user_id: user_id).pluck(:friend_user_id)
      emails = User.where("id IN (?)", friends).pluck(:email)

      emails.each do |email|

        begin
          mandrill = Mandrill::API.new '_jNnzxqtlL9rUB8Y7Kbhog'
          template_name = "post"
          template_content = [{"content"=>"example content", "name"=>"example name"}]
  		    message = {"subject"=>"iVote חבר/ה שלך כתב/ה קמפיין חדש באפליקציית",
  		     "text"=>"iVote חבר/ה שלך כתב/ה קמפיין חדש באפליקציית",
  		     "auto_html"=>nil,
  		     "google_analytics_domains"=>["ivote.org.il"],
  		     "tags"=>["friend-post"],
  		     "headers"=>{"Reply-To"=>"we@ivote.org.il"},
  		     "return_path_domain"=>nil,
  		     "auto_text"=>nil,
  		     "to"=>
                [{"email"=>email,
                    "type"=>"to",
                    "name"=>"David Virtser"}],
             "from_name"=>"iVote App",
             "preserve_recipients"=>nil,
             "track_clicks"=>nil,
             "track_opens"=>nil,
             "inline_css"=>nil,
             "from_email"=>"we@ivote.org.il",
             "recipient_metadata"=>
                [{"rcpt"=>email, "values"=>{"user_id"=>user_id}}],
             "view_content_link"=>nil,
             "url_strip_qs"=>nil,
             "signing_domain"=>nil,
             "tracking_domain"=>nil,
             "important"=>false,
             "html"=>""}
            async = true
            # ip_pool = "Main Pool"
            # send_at = "example send_at"
            result = mandrill.messages.send_template template_name, template_content, message, async

            logger.info "Email sending result: " + result.to_yaml
            
        rescue Mandrill::Error => e
            # Mandrill errors are thrown as exceptions
            logger.error "A mandrill error occurred: #{e.class} - #{e.message}"
            # raise
        end   
      end   
    end
end
