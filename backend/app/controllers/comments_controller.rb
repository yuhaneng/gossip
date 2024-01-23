class CommentsController < ApplicationController
  before_action :set_comment, only: %i[ show update destroy vote ]
  before_action :authenticate_user, except: %i[ index show ]
  before_action :correct_user, only: %i[ update destroy ]

  # GET /comments?sort=:sort&page=:page&user=:user
  # GET /comments?sort=:sort&page=:page&post=:post
  # Get comments by user or post, sorted and paginated.
  def index
    if (params[:sort] && params[:page])

      # Get comments by username.
      if (params[:user])
        user = User.find_by(id: params[:user])
        comments = user.comments if !user.nil?

      # Get comments by post.
      elsif (params[:post_id])
        post = Post.find_by(id: params[:post_id])
        comments = post.comments if !post.nil?
      end

      if comments
        # Order comments by rating or time.
        if (params[:sort] == "rating")
          comments = comments.sort_by { |comment| 
            comment.comment_votes.where(vote: false).count - comment.comment_votes.where(vote: true).count
          }
        else
          comments = comments.order("created_at" => :desc)
        end

        # Paginate commments.
        comments = comments.slice(0, Constants::POSTS_PER_PAGE * params[:page].to_i)

        if comments
          render json: comments.map {|comment| create_comment_data(comment)}
        else
          render json: []
        end
      else
        render json: {error: "Could not get comments."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Could not get comments."}, status: :unprocessable_entity
    end
  end

  # GET /comments/1
  # Get comment by id.
  def show
    render json: create_comment_data(@comment)
  end

  # POST /comments
  # Create new comment under current user and post specified by id.
  def create
    @comment = current_user.comments.build(comment_params)
    @post = Post.find_by(id: comment_params[:post_id])
    @post.comments << @comment if !@post.nil?

    if @comment.save
      head :ok
    else
      render json: {error: "Comment could not be created."}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  # Update comment by id.
  def update
    if @comment.update(edit_params)
      head :ok
    else
      render json: {error: "Comment could not be edited."}, status: :unprocessable_entity
    end
  end

  # DELETE /comments/1
  # Destroy comment by id.
  def destroy
    if @comment.destroy
      head :ok
    else
      render json: {error: "Comment could not be deleted."}, status: :unprocessable_entity
    end
  end

  # POST /comments/:id/vote
  # Destroy old comment vote if exists, create new comment vote if upvoted or downvoted.
  def vote
    old_vote = current_user.comment_votes.find_by(comment_id: params[:id])
    old_vote.destroy! if !old_vote.nil?
    if vote_params[:vote] != "none"
      vote = current_user.comment_votes.build(vote: vote_params[:vote] == "up")
      @comment.comment_votes << vote
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
    # Set @comment to comment specified by id.
    def set_comment
      @comment = Comment.find(params[:id])
      render json: {error: "Could not find comment."}, status: :unprocessable_entity if @comment.nil?
    end

    def comment_params
      params.require(:comment).permit(:post_id, :content)
    end

    def edit_params
      params.require(:comment).permit(:content)
    end

    def vote_params
      params.require(:vote).permit(:vote)
    end

    # Check user is querying their own comment or is an admin before allowing update or destroy.
    def correct_user
      comment = current_user.comments.find_by(id: params[:id])
      render json: {error: "Not authorized to perform this action."}, status: :unauthorized if comment.nil? && !current_user.admin
    end

    # Create comment data, including current user's vote.
    def create_comment_data(comment)
      if logged_in? 
        vote = current_user.comment_votes.find_by(comment_id: comment.id)
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

      comment_data = {
        id: comment.id,
        author_id: !comment.user.nil? ? comment.user.id : "",
        author: !comment.user.nil? ? comment.user.username : "",
        post_id: comment.post_id,
        content: comment.content,
        upvotes: comment.comment_votes.where(vote: true).count,
        downvotes: comment.comment_votes.where(vote: false).count,
        user_vote: user_vote,
        created_at: comment.created_at,
        updated_at: comment.updated_at
      }
    end
end
