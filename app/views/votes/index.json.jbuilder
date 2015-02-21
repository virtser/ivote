json.array!(@votes) do |vote|
  json.extract! vote, :id, :party_id, :user_id
  json.url vote_url(vote, format: :json)
end
