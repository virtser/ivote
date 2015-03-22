require 'pushwoosh'
require 'mandrill'
require 'stream'
require 'mixpanel-ruby'

class Generic

  def self.get_mixpanel_tracker
    return Mixpanel::Tracker.new(ENV['MIXPANEL_TOKEN'])
  end

  def self.get_streams_client
    return Stream::Client.new(ENV['STREAM_SECRET'], ENV['STREAM_TOKEN'], '2148', :location => 'eu-central')
  end

	def self.send_notificatioin(user_id, message)
	  friends = Relation.where(user_id: user_id).pluck(:friend_user_id)
	  friends_details = User.where("id IN (?)", friends).select('email', 'device_token')

	  emailList = []
	  device_tokensList = []

	  friends_details.each do |fd|
	    unless fd.device_token.nil?
	      device_tokensList.push(fd.device_token)          
	    else
        unless fd.email.nil?
	       emailList.push({"email"=>fd.email, "type"=>"to"})
        end
	    end
	  end

	  if emailList.length > 0
	    send_email(emailList, message)      
	  end

	  if device_tokensList.length > 0
	    push_notification(device_tokensList, message)      
	  end
	end

private  
  def self.push_notification(device_tokensList, message) 
    begin
      auth_hash = { auth: ENV['PUSHWOOSH_TOKEN'], application: ENV['PUSHWOOSJ_APPID'] }
      client = Pushwoosh::PushNotification.new(auth_hash)
      client.notify_devices(message, device_tokensList, { :send_date  => "now" })
    rescue Pushwoosh::Error => e
      Rails.logger.error "A pushwoosh error occurred: #{e.class} - #{e.message}"
    end   
  end

  def self.send_email(emailList, message)
    begin
        mandrill = Mandrill::API.new ENV['MANDRILL_TOKEN']
        template_name = "vote"
        template_content = [{"content"=>"example content", "name"=>"example name"}]
        message = {"subject"=> message,
         "text"=> message,
         "auto_html"=>nil,
         "google_analytics_domains"=>["ivote.org.il"],
         "tags"=>["friend-vote"],
         "headers"=>{"Reply-To"=>"we@ivote.org.il"},
         "return_path_domain"=>nil,
         "auto_text"=>nil,
         "to"=> emailList,
         "from_name"=>"iVote App",
         "preserve_recipients"=>nil,
         "track_clicks"=>nil,
         "track_opens"=>nil,
         "inline_css"=>nil,
         "from_email"=>"we@ivote.org.il",
         "view_content_link"=>nil,
         "url_strip_qs"=>nil,
         "signing_domain"=>nil,
         "tracking_domain"=>nil,
         "important"=>false,
         "html"=>""}
        async = true

        result = mandrill.messages.send_template template_name, template_content, message, async
    rescue Mandrill::Error => e
        Rails.logger.error "A mandrill error occurred: #{e.class} - #{e.message}"
    end   
  end	    
end