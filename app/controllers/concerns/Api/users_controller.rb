class Api::V1::UsersController < ApplicationController
    
    def index
        @users = User.all
        if @users
            render json: {
            users: @users
        }
        else
            render json: {
            status: 500,
            errors: ['no users found']
        }
        end
    end
def show
    @user = User.find(params[:id])
        if @user
            render json: {
            user: @user
        }
        else
            render json: {
            status: 500,
            errors: ['user not found']
            }
        end
    end
    
    def create
        @user = User.new(user_params)
            if @user.save
                login!  
                render json: {
                status: :created,
                user: @user
            }
            else 
                render json: {
                status: 500,
                errors: @user.errors.full_messages
            }
            end
    end

# PATCH/PUT /users/1
    def update
    @user = User.find(params[:id])
    if @user.update(user_params)
        render json: @user
    else
        render json: @user.errors, status: :unprocessable_entity
    end
    end

private
    
    def user_params
        params.permit(:id, :first_name, :last_name, :email, :password, :password_confirmation, :isAdmin, :shipping => {}, :payment => {})
    end
end