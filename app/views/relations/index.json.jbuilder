json.array!(@relations) do |relation|
  json.extract! relation, :id, :fbuser_id, :friend_fbuser_id
  json.url relation_url(relation, format: :json)
end
