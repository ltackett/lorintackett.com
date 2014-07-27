class PortfolioItem < ActiveRecord::Base
  acts_as_list

  has_and_belongs_to_many :skills
  validates_presence_of :title, :description
end
