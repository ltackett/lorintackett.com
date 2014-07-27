class Api::V1::PortfolioItemsController < ApplicationController
  respond_to :json

  def index
    respond_with PortfolioItem.all
  end

  def show
    respond_with portfolio_item
  end

  def create
    respond_with :api, :v1, portfolio_item.create(portfolio_item_params)
  end

  def update
    respond_with portfolio_item.update(portfolio_item_params)
  end

  def destroy
    respond_with portfolio_item.destroy
  end

  private

  def portfolio_item
    PortfolioItem.find(params[:id])
  end

  def portfolio_item_params
    params.require(:portfolio_item).permit(:title, :description)
  end

end