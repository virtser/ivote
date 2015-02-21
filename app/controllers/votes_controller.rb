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

    @friends_of_friends = Relation.where(user_id: @friends).pluck(:friend_user_id)
    logger.info "My friends of friends ids: " + @friends.to_yaml

    @friends.push(@friends_of_friends) # add friends of friends

    if @friends.length > 0
      @results = Vote.select('count(id) as number_of_votes, party_id').where(user_id: @friends).group(:party_id)
      render json: @results, status: :ok
    else
      render json: { message: "Error occured!"}, status: :unprocessable_entity
    end

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

    respond_to do |format|
      if @vote.save
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
end
