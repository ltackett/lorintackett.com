class Skill < ActiveRecord::Base
  has_and_belongs_to_many :portfolio_items

  validates_presence_of :title
end
