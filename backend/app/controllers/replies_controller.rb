class RepliesController < ApplicationController
  before_action :set_reply, only: %i[ show update destroy vote ]
  before_action :authenticate_user, except: %i[ index show ]
  before_action :correct_user, only: %i[ update destroy ]

  # GET /replies
  def index
    if (params[:page])

      # Get replies by username.
      if (params[:user])
        user = User.find_by(username: params[:user])
        replies = user.replies if !user.nil?

      # Get replies by comment.
      elsif (params[:comment_id])
        comment = Comment.find_by(id: params[:comment_id])
        replies = comment.replies if !comment.nil?
      end

      if replies
        # Order replies by time.
        replies = replies.order("created_at" => :desc)

        # Paginate replies.
        replies = replies
          .limit(Constants::POSTS_PER_PAGE * params[:page].to_i)
        
        render json: replies.map {|reply| create_reply_data(reply)}
      else
        render json: {error: "Could not get replies."}, status: :unprocessable_entity
      end
    else
      render json: {error: "Could not get replies."}, status: :unprocessable_entity
    end
  end

  # GET /replies/1
  def show
    render json: create_reply_data(@reply)
  end

  # POST /replies
  def create
    @reply = current_user.replies.build(reply_params)
    @comment = Comment.find_by(id: reply_params[:comment_id])
    @comment.replies << @reply if !@comment.nil?

    if @reply.save
      head :ok
    else
      render json: {error: "Reply could not be created."}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /replies/1
  def update
    if @reply.update(edit_params)
      head :ok
    else
      render json: {error: "Reply could not be edited."}, status: :unprocessable_entity
    end
  end

  # DELETE /replies/1
  def destroy
    if @reply.destroy
      head :ok
    else
      render json: {error: "Reply could not be deleted."}, status: :unprocessable_entity
    end
  end

  # POST /replies/:id/vote
    def vote
      old_vote = current_user.reply_votes.find_by(reply_id: params[:id])
      old_vote.destroy! if !old_vote.nil?
      if vote_params[:vote] != "none"
        vote = current_user.reply_votes.build(vote: vote_params[:vote] == "up")
        @reply.reply_votes << vote
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
    def set_reply
      @reply = Reply.find_by(id: params[:id])
      render json: {error: "Could not find reply."}, status: :unprocessable_entity if @reply.nil?
    end

    def reply_params
      params.require(:reply).permit(:comment_id, :content)
    end

    def edit_params
      params.require(:reply).permit(:content)
    end

    def vote_params
      params.require(:vote).permit(:vote)
    end

    # Check user is querying their own comment before allowing update or destroy.
    def correct_user
      reply = current_user.replies.find_by(id: params[:id])
      render json: {error: "Not authorized to perform this action."}, status: :unauthorized if reply.nil? && !current_user.admin
    end

    def create_reply_data(reply)
      if logged_in? 
        vote = current_user.reply_votes.find_by(reply_id: reply.id)
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

      reply_data = {
        id: reply.id,
        author: !reply.user.nil? ? reply.user.username : "",
        comment_id: reply.comment_id,
        post_id: reply.comment.post.id,
        content: reply.content,
        upvotes: reply.reply_votes.where(vote: true).count,
        downvotes: reply.reply_votes.where(vote: false).count,
        user_vote: user_vote,
        created_at: reply.created_at,
        updated_at: reply.updated_at
      }
    end
end
