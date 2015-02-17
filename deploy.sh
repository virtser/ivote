cd client
gulp
cd ..
cp -rf client/www/ public/client/
git add --all .
git commit -m "client changes"
git push heroku master
heroku run rake db:migrate