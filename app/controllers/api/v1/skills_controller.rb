class Api::V1::SkillsController < ApplicationController
  respond_to :json

  def index
    respond_with Skill.all
  end

  def show
    respond_with skill
  end

  def create
    respond_with :api, :v1, skill.create(skill_params)
  end

  def update
    respond_with skill.update(skill_params)
  end

  def destroy
    respond_with skill.destroy
  end

  private

  def skill
    Skill.find(params[:id])
  end

  def skill_params
    params.require(:skill).permit(:title)
  end

end