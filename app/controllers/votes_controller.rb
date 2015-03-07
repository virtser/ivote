require 'mixpanel-ruby'

class VotesController < ApplicationController
  before_action :set_vote, only: [:show, :edit, :update, :destroy]

  # GET /results
  def results
    @myuser_id = params[:user_id]

    @friends = Relation.where(user_id: @myuser_id).pluck(:friend_user_id)

    if @friends.length > 0
      @friends_of_friends = Relation.where(user_id: @friends).pluck(:friend_user_id)

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

  # GET /votes/1
  # GET /votes/1.json
  def show
  end

  # POST /votes
  # POST /votes.json
  def create
    @vote = Vote.new(vote_params)

    respond_to do |format|
      if @vote.save

        tracker = Mixpanel::Tracker.new('5169a311c1cad013734458bb88005dcd')
        tracker.track(vote_params[:user_id], 'Vote')

        Generic.send_notificatioin(params[:vote][:user_id], 'חבר/ה שלך הצביע/ה באפליקציית iVote.')

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

        tracker = Mixpanel::Tracker.new('5169a311c1cad013734458bb88005dcd')
        tracker.track(vote_params[:user_id], 'Vote Update')

        Generic.send_notificatioin(params[:vote][:user_id], 'חבר/ה שלך הצביע/ה באפליקציית iVote.')
        
        format.html { redirect_to @vote, notice: 'Vote was successfully updated.' }
        format.json { render :show, status: :ok, location: @vote }
      else
        format.html { render :edit }
        format.json { render json: @vote.errors, status: :unprocessable_entity }
      end
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

end
