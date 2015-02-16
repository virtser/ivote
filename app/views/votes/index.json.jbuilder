json.array!(@votes) do |vote|
  json.extract! vote, :id, :email, :party_id
  json.url vote_url(vote, format: :json)
end
