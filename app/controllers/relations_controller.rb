class RelationsController < ApplicationController
  before_action :set_relation, only: [:show, :edit, :update, :destroy]

  # GET /relations
  # GET /relations.json
  def index
    @relations = Relation.all
  end

  # GET /relations/1
  # GET /relations/1.json
  def show
  end

  # POST /relations
  # POST /relations.json
  def create
    @relation = Relation.new(relation_params)

    respond_to do |format|
      if @relation.save
        format.html { redirect_to @relation, notice: 'Relation was successfully created.' }
        format.json { render :show, status: :created, location: @relation }
      else
        format.html { render :new }
        format.json { render json: @relation.errors, status: :unprocessable_entity }
      end
    end
  end

 
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_relation
      @relation = Relation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def relation_params
      params.require(:relation).permit(:user_id, :friend_user_id)
    end
end
