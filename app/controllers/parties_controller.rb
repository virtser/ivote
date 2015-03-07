class PartiesController < ApplicationController
  before_action :set_party, only: [:show, :edit, :update, :destroy]

  # GET /parties
  # GET /parties.json
  def index
    # Cache response
    if Rails.cache.read("parties").nil?
      @parties = Party.all
      Rails.cache.write("parties", @parties)
      logger.info "Parties Not Cached"
    else
      @parties = Rails.cache.read("parties")
      logger.info "Parties Cached"
    end
  end

  # GET /parties/1
  # GET /parties/1.json
  def show
  end

end
