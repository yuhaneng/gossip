class PostsController < ApplicationController
    before_action :set_post, only: %i[ show update destroy vote]
    before_action :authenticate_user, except: %i[ index show ]
    before_action :correct_user, only: %i[ update destroy ]
  
    # GET /posts?
    def index
      if (params[:sort] && params[:page])

        # Get posts by username.
        if (params[:user])
          user = User.find_by(username: params[:user])
          posts = user.posts if !user.nil?
  
        # Get posts by tags.
        elsif (params[:tags])
          if (params[:tags] == "[]")
            posts = Post.all
          else
            posts = Post.where("tags @> ARRAY[?]::varchar[]", JSON.parse(params[:tags]))
          end
        else 
          posts = Post.all
        end
        
        if posts
          # Order posts by rating or time.
          if (params[:sort] == "rating")
            posts = posts.sort_by { |post| 
              post.post_votes.where(vote: false).count - post.post_votes.where(vote: true).count
            }
          else
            posts = posts.order(created_at: :desc)
          end
    
          # Paginate posts.
          posts = posts.slice(0, Constants::POSTS_PER_PAGE * params[:page].to_i)
          
          if posts
            render json: posts.map {|post| create_post_data(post, false)}
          else
            render json: []
          end
        else
          render json: {error: "Could not get posts."}, status: :unprocessable_entity
        end
      else
        render json: {error: "Could not get posts."}, status: :unprocessable_entity
      end
    end
  
    # GET /posts/:id
    def show
      render json: create_post_data(@post, true)
    end
  
    # POST /posts
    def create
      @post = current_user.posts.build(post_params)
  
      if @post.save
        head :ok
      else
        render json: {error: "Post could not be created."}, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /posts/:id
    def update
      if @post.update(post_params)
        head :ok
      else
        render json: {error: "Post could not be edited."}, status: :unprocessable_entity
      end
    end
  
    # DELETE /posts/:id
    def destroy
      if @post.destroy
        head :ok
      else
        render json: {error: "Post could not be deleted."}, status: :unprocessable_entity
      end
    end
  
    # POST /posts/:id/vote
    def vote
      old_vote = current_user.post_votes.find_by(post_id: params[:id])
      old_vote.destroy! if !old_vote.nil?
      if vote_params[:vote] != "none"
        vote = current_user.post_votes.build(vote: vote_params[:vote] == "up")
        @post.post_votes << vote
        if vote.save
          head :ok
        else
          render json: {error: "Could not create vote."}, status: :unprocessable_entity
        end
      else
        head :ok
      end
    end
  
    private
      # Find specified post before update or destroy.
      def set_post
        @post = Post.find(params[:id])
        render json: {error: "Could not find post."}, status: :unprocessable_entity if @post.nil?
      end
  
      def post_params
        params.require(:post).permit(:title, :content, tags: [])
      end
  
      def vote_params
        params.require(:vote).permit(:vote)
      end
  
      # Check user is querying their own post before allowing update or destroy.
      def correct_user
        post = current_user.posts.find_by(id: params[:id])
        render json: {error: "Not authorized to perform this action."}, status: :unauthorized if post.nil? && !current_user.admin
      end
  
      def create_post_data(post, show_vote)
        if show_vote && logged_in? 
          vote = current_user.post_votes.find_by(post_id: post.id)
          if !vote.nil?
            if vote.vote
              user_vote = "up"
            else 
              user_vote = "down"
            end
          else
            user_vote = "none"
          end
        else 
          user_vote = "none"
        end

        post_data = {
            id: post.id,
            author: !post.user.nil? ? post.user.username : "",
            title: post.title, 
            content: post.content, 
            tags: post.tags,
            upvotes: post.post_votes.where(vote: true).count,
            downvotes: post.post_votes.where(vote: false).count,
            user_vote: user_vote,
            created_at: post.created_at,
            updated_at: post.updated_at,
        }
      end
  end
  