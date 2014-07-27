class PortfolioItemSerializer < ActiveModel::Serializer
  attributes :id,
             :position,
             :title,
             :description,
             :featured,
             :featured_image,
             :background_image,
             :background_color,
             :foreground_color,
             :skills
end
