cd client
gulp
cd ..
cp -rf client/www/ public/client/
git add --all .
git commit -m "client changes"

BRANCH=git rev-parse --abbrev-ref HEAD

git push heroku $BRANCH:master
heroku run rake db:migrate
heroku run rake db:seed