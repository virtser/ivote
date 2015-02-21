json.array!(@relations) do |relation|
  json.extract! relation, :id, :user_id, :friend_user_id
  json.url relation_url(relation, format: :json)
end
