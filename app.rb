#!/usr/bin/env ruby
# -*- encoding: UTF-8 -*-

require 'sinatra'
require 'sinatra/json'
require 'RMagick'
require 'yaml'
require 'json'

# 設定と初期化
pwd = File.dirname(__FILE__)
set :public_folder, File.join(pwd, 'public')
idols = YAML.load(open(File.join(pwd, 'millionstars.yaml')))

get '/' do
  send_file File.join(pwd, 'public', 'index.html')
end

get '/images/:file' do |filename|
  send_file File.join(pwd, 'images', filename)
end

get '/millionstars.json' do
  json idols
end

# 画像をつくる
post '/image' do
  a = params[:ids].zip(params[:images], params[:texts]).map do |id, i, t|
    idol = idols.find{|x|x['id']==id}
    {
      face: idol['images'][i.to_i],
      name: idol['name'],
      text: t,
    }
  end

  gen = ImageGenerator.new
  a.each do |h|
    gen.add(h[:face], h[:name], h[:text])
  end
  image = gen.generate()

  image.format = "JPEG"
  attachment('imasml%05d.jpg' % rand(100000))
  image.to_blob
end

# 画像を作る人
require 'open-uri'
class ImageGenerator
  def initialize()
    @width = 640
    @unit_height = 168
    @images = []

    waku_path = 'http://m.ip.bn765.com/11006e59e67'
    @waku = open(waku_path) {|f| Magick::Image.from_blob(f.read())[0] }
  end

  def generate()
    canvas = Magick::Image.new(@width, @unit_height * @images.size)

    # 背景だ
    bg_path = 'http://m.ip.bn765.com/11002c9b1d8'
    bg = open(bg_path) {|f| Magick::Image.from_blob(f.read())[0] }
    canvas.composite_tiled!(bg)

    # セリフを並べる
    @images.each_with_index do |image, i|
      canvas.composite!(image, 0, @unit_height * i, Magick::OverCompositeOp)
    end

    canvas
  end

  def add(face_path, name, text)
    @images << draw_unit(face_path, name, text)
  end

  private

  def draw_unit(face_path, name, text)
    canvas = Magick::Image.new(@width, @unit_height)
    canvas.alpha(Magick::TransparentAlphaChannel)
    face = open(face_path) {|f| Magick::Image.from_blob(f.read())[0] }

    canvas.composite!(face, 8, 8, Magick::OverCompositeOp)
    canvas.composite!(@waku, 174, 8, Magick::OverCompositeOp)

    # なまえ
    namedraw = Magick::Draw.new
    namedraw.pointsize = 26
    namedraw.fill = '#f33281'
    namedraw.gravity(Magick::NorthWestGravity).font('ipag.ttc').font_weight('bold')
    namedraw.text(184, 16, name)
    namedraw.draw(canvas)

    # せりふ
    textdraw = Magick::Draw.new
    textdraw.pointsize = 26
    textdraw.fill = 'black'
    textdraw.gravity(Magick::NorthWestGravity).font('ipag.ttc').font_weight('bold')
    draw_text(canvas, textdraw, text, 184, 46, 30)
    textdraw.draw(canvas)

    canvas
  end

  # 複数行の文字列を書く
  def draw_text(canvas, draw, str, x, y_offset, line_height)
    str.split("\n").each_with_index do |line, i|
      y = y_offset + line_height * i
      draw.text(x, y, line)
    end
  end
end
