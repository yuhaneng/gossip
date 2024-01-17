class PostsController < ApplicationController
    before_action :set_post, only: %i[ show update destroy ] #vote
    before_action :authenticate_user, except: %i[ index show ]
    before_action :correct_user, only: %i[ update destroy ]
  
    # GET /posts?
    def index
      if (query_params[:sort] && query_params[:page])

        # Get posts by username.
        if (query_params[:user])
          user = User.find_by(username: query_params[:user])
          posts = user.posts  
  
        # Get posts by tags.
        elsif (query_params[:tags])
          if (query_params[:tags] == [])
            posts = Post.all
          else
            posts = Post.where("tags @> ARRAY[?]::varchar[]", query_params[:tags])
          end
        else 
          posts = Post.all
        end
  
        # Order posts by rating or time.
        if (query_params[:sort] == "rating")
        #   posts = posts.order("upvotes - downvotes")
        else
          posts = posts.order("created_at" => :desc)
        end
  
        # Paginate posts.
        posts = posts
          .limit(Constants::POSTS_PER_PAGE)
          .offset(Constants::POSTS_PER_PAGE * (query_params[:page].to_i - 1))
  
        render json: posts.map {|post| create_post_data(post)}
      else
        render json: {error: "Could not get posts."}, status: :unprocessable_entity
      end
    end
  
    # GET /posts/:id
    def show
      render json: create_post_data(@post)
    end
  
    # POST /posts
    def create
      @post = current_user.posts.build(post_params)
  
      if @post.save
        render json: create_post_data(@post), status: :created
      else
        render json: @post.errors, status: :unprocessable_entity
      end
    end
  
    # PATCH/PUT /posts/:id
    def update
      if @post.update(post_params)
        render json: create_post_data(@post)
      else
        render json: @post.errors, status: :unprocessable_entity
      end
    end
  
    # DELETE /posts/:id
    def destroy
      @post.destroy!
    end
  
    # PATCH/PUT /posts/:id/vote
    # def vote
    #   old_vote = current_user.post_votes.find_by(post_id: params[:id])
    #   old_vote.destroy! if !old_vote.nil?
    #   if vote_params[:vote] != "none"
    #     vote = current_user.post_votes.build(up?: vote_params[:vote] == "up")
    #     @post.post_votes << vote
    #     if vote.save
    #       head :ok
    #     else
    #       render json: {error: "Could not create vote."}, status: :unprocessable_entity
    #     end
    #   else
    #     head :ok
    #   end
    # end
  
    private
      # Find specified post before update or destroy.
      def set_post
        @post = Post.find(params[:id])
      end

      def query_params
        params.require(:query).permit(:sort, :page, :user, tags: [] )
      end
  
      def post_params
        params.require(:post).permit(:title, :content, tags: [])
      end
  
      def vote_params
        params.require(:vote).permit(:vote)
      end
  
      # Authenticate user's token before allowing create, update or destroy.
      def authenticate_user
        render json: {error: "Not logged in."}, status: :unauthorized if !logged_in?
      end
  
      # Check user is querying their own post before allowing update or destroy.
      def correct_user
        @post = current_user.posts.find_by(id: params[:id])
        render json: {error: "Not authorized to perform this action."}, status: :unauthorized if @post.nil?
      end
  
      def create_post_data(post)
        post_data = {
            id: post.id,
            title: post.title, 
            content: post.content, 
            tags: post.tags,
            # upvotes: post.post_votes.where(up?: true).count,
            # downvotes: post.post_votes.where(up?: false).count,
            created_at: post.created_at,
            updated_at: post.updated_at,
        }
        post_data[:author] = post.user.username if !post.user.nil?
        # if logged_in?
        #   vote = current_user.post_votes.find_by(post_id: post.id)
        #   if !vote.nil? && vote.up?
        #     post_data[:user_vote] = "up"
        #   elsif !vote.nil? && !vote.up?
        #     post_data[:user_vote] = "down"
        #   end
        # else
        #   post_data[:user_vote] = "none"
        # end
        post_data
      end
  end
  