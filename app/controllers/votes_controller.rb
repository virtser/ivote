require 'mandrill'

class VotesController < ApplicationController
  before_action :set_vote, only: [:show, :edit, :update, :destroy]


  # GET /votes/1
  # GET /votes/1.json
  def results
    logger.info "My user_id: " + params[:user_id]
    @myuser_id = params[:user_id]

    #TODO: Return voting results of my friends aggregated by parties.
    @friends = Relation.where(user_id: @myuser_id).pluck(:friend_user_id)
    logger.info "My friends ids: " + @friends.to_yaml

    if @friends.length > 0
      @friends_of_friends = Relation.where(user_id: @friends).pluck(:friend_user_id)
      logger.info "My friends of friends ids: " + @friends.to_yaml

      if @friends_of_friends.length > 0
        @friends.push(@friends_of_friends) # add friends of friends
      end
    end

    @friends.push(@myuser_id) # add myself

    if @friends.length > 0
      @results = Vote.select('count(id) as number_of_votes, party_id').where(user_id: @friends).group(:party_id)
      render json: @results, status: :ok
    else
      render json: { message: "Error occured!"}, status: :unprocessable_entity
    end
  end

  def user
    @myuser_id = params[:user_id]
    @my_vote = Vote.where(user_id: @myuser_id)
    render json: @my_vote, status: :ok

  end

  # GET /votes
  # GET /votes.json
  def index
    @votes = Vote.all
  end

  # GET /votes/1
  # GET /votes/1.json
  def show
  end

  # GET /votes/new
  def new
    @vote = Vote.new
  end

  # GET /votes/1/edit
  def edit
  end

  # POST /votes
  # POST /votes.json
  def create
    @vote = Vote.new(vote_params)

    already_voted = Vote.where(user_id: vote_params[:user_id])

    unless already_voted[:id].nil?
      render json: 'Already voted', status: :unprocessable_entity
      return
    end

    respond_to do |format|
      if @vote.save

        send_mail

        format.html { redirect_to @vote, notice: 'Vote was successfully created.' }
        format.json { render :show, status: :created, location: @vote }
      else
        format.html { render :new }
        format.json { render json: @vote.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /votes/1
  # PATCH/PUT /votes/1.json
  def update
    respond_to do |format|
      if @vote.update(vote_params)

        send_mail
        
        format.html { redirect_to @vote, notice: 'Vote was successfully updated.' }
        format.json { render :show, status: :ok, location: @vote }
      else
        format.html { render :edit }
        format.json { render json: @vote.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /votes/1
  # DELETE /votes/1.json
  def destroy
    @vote.destroy
    respond_to do |format|
      format.html { redirect_to votes_url, notice: 'Vote was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vote
      @vote = Vote.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def vote_params
      params.require(:vote).permit(:user_id, :party_id)
    end

    def send_mail
      user_id = params[:vote][:user_id].to_s

      friends = Relation.where(user_id: user_id).pluck(:friend_user_id)
      emails = User.where("id IN (?)", friends).pluck(:email)

      emails.each do |email|

        begin
            mandrill = Mandrill::API.new '_jNnzxqtlL9rUB8Y7Kbhog'
            template_name = "vote"
            template_content = [{"content"=>"example content", "name"=>"example name"}]
            message = {"subject"=>"iVote חבר/ה שלך הצביע/ה באפליקציית",
             "text"=>"iVote חבר/ה שלך הצביע/ה באפליקציית",
             "auto_html"=>nil,
             "google_analytics_domains"=>["ivote.org.il"],
             "tags"=>["friend-vote"],
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
