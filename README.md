おはなしジェネレーター
======================

## 動かし方(ローカル)

1. ruby や libmagick などをインストールする
2. bundle
3. gem install shotgun
4. shotgun

localhost:9393 で見える。

## 動かし方(heroku)

1. Heroku Toolbelt をインストールする
2. 
 - 新規: heroku create <var>appname</var>
 - 既存: heroku git:remote --app <var>appname</var>
3. git push heroku master
