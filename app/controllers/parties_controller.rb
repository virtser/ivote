class PartiesController < ApplicationController

  # GET /parties
  # GET /parties.json
  def index
    # Cache response
      @parties = Party.all
      expires_in(1.days, public: true)
      # logger.info "Parties Cached"
  end

  # GET /parties/1
  # GET /parties/1.json
  def show
  end

end
