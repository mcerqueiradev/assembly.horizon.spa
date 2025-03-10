import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommentService } from '../../../_services/comment.service';
import { CreateCommentCommand } from '../../../_models/Comment/createCommentCommand';
import { RetrieveCommentResponse } from '../../../_models/Comment/retrieveCommentResponse';
import { ToggleHelpfulCommand } from '../../../_models/Comment/toggleHelpfulCommand';
import { ToggleHelpfulResponse } from '../../../_models/Comment/toggleHelpfulResponse';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'], // Corrigi 'styleUrl' para 'styleUrls'
})
export class CommentsComponent implements OnInit, OnChanges  {
  @Input() propertyId!: string;
  comments: RetrieveCommentResponse[] = [];
  commentForm: FormGroup;

  replyingTo: string | null = null;
  showReplyForm: boolean = false;
  replyForm: FormGroup;
  replyingToReply: { commentId: string, replyId: string } | null = null;

  isLoggedIn: boolean = false;
  currentUser: any;
  userRating: number = 0;
  isSubmitting: boolean = false;
  averageRating: number = 0;

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      message: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    this.replyForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    const userString = sessionStorage.getItem('loggedUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
      this.isLoggedIn = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['propertyId'] && this.propertyId) {
      this.loadComments(); // Chama loadComments quando propertyId muda e não é null
    }
  }

  loadComments() {
    console.log('Property ID:', this.propertyId); // Verifica se o ID está correto
    this.commentService.getCommentsByPropertyId(this.propertyId).subscribe(response => {
        console.log(response); // Log da resposta completa

        // Acesse o array de comentários
        if (response && response.comments && Array.isArray(response.comments)) {
            this.comments = response.comments; // Atribua a lista de comentários
            this.averageRating = this.calculateAverageRating(); // Atualiza a média
        } else {
            console.error('Expected comments to be an array but got:', response);
            this.comments = []; // Defina como array vazio se não for um array
            this.averageRating = 0; // Reinicia a média se não houver comentários
        }
    }, error => {
        console.error('Error fetching comments:', error);
        this.comments = []; // Lide com erros adequadamente
        this.averageRating = 0; // Reinicia a média em caso de erro
    });
  }

  submitComment() {
    if (this.commentForm.valid && this.isLoggedIn) {
      const command: CreateCommentCommand = {
        propertyId: this.propertyId,
        userId: this.currentUser.userId,
        message: this.commentForm.get('message')?.value,
        rating: this.commentForm.get('rating')?.value
      };

      this.isSubmitting = true;
      
      this.commentService.createComment(command).subscribe({
        next: (response) => {
          this.loadComments(); // Chama loadComments após a submissão
          setTimeout(() => {
            this.isSubmitting = false;
            this.commentForm.reset();
            this.userRating = 0; // Reinicia o rating do usuário

            // A média já está sendo atualizada no loadComments
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating comment:', error);
        }
      });
    }
  }

  toggleReplyForm(commentId: string, replyId?: string) {
    // For parent comment replies
    if (!replyId) {
      this.showReplyForm = this.replyingTo !== commentId;
      this.replyingTo = this.showReplyForm ? commentId : null;
      this.replyingToReply = null;
      this.replyForm.reset();
      return;
    }
  
    // For second level replies
    const isSecondLevelReply = this.comments.some(comment => 
      comment.replies?.some(reply => reply.id === replyId)
    );
  
    if (isSecondLevelReply) {
      this.showReplyForm = !(this.replyingToReply?.replyId === replyId);
      this.replyingToReply = this.showReplyForm ? { commentId, replyId } : null;
      this.replyingTo = null;
      this.replyForm.reset();
      return;
    }
  
    // Block third level replies
    return;
  }

  submitReply(parentCommentId: string, replyId?: string) {
    if (this.replyForm.valid && this.isLoggedIn) {
      const command: CreateCommentCommand = {
        propertyId: this.propertyId,
        userId: this.currentUser.userId,
        message: this.replyForm.get('message')?.value,
        parentCommentId: replyId || parentCommentId // Use replyId if replying to a reply
      };

      this.isSubmitting = true;
      
      this.commentService.createComment(command).subscribe({
        next: (response) => {
          this.loadComments();
          this.showReplyForm = false;
          this.replyingTo = null;
          this.replyingToReply = null;
          this.replyForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating reply:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  isMaxNestingLevel(reply: any): boolean {
    return reply.replies && reply.replies.length > 0;
  }

  toggleHelpful(commentId: string) {
    if (!this.isLoggedIn) {
        return;
    }

    const command: ToggleHelpfulCommand = {
        commentId: commentId,
        userId: this.currentUser.userId,
        isHelpful: true
    };

    this.commentService.toggleHelpful(command.commentId, command.userId, command.isHelpful)
        .subscribe({
            next: (response: ToggleHelpfulResponse) => {
                this.updateCommentHelpfulCount(commentId, response.helpfulCount, response.isHelpful);
            },
            error: (error) => {
                console.error('Error toggling helpful:', error);
            }
        });
}

private updateCommentHelpfulCount(commentId: string, newCount: number, isHelpful: boolean) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
        comment.helpfulCount = newCount || 0;
        comment.isHelpful = isHelpful;
        return;
    }

    this.comments.forEach(parentComment => {
        if (parentComment.replies) {
            const reply = parentComment.replies.find(r => r.id === commentId);
            if (reply) {
                reply.helpfulCount = newCount || 0;
                reply.isHelpful = isHelpful;
            }
        }
    });
}
  setRating(rating: number) {
    this.userRating = rating;
    this.commentForm.patchValue({ rating });
  }

  calculateAverageRating(): number {
    const parentComments = this.comments.filter(comment => !comment.parentCommentId);
    
    if (parentComments.length === 0) {
        return 0;
    }
    
    const totalRating = parentComments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
    return parseFloat((totalRating / parentComments.length).toFixed(1));
}

}
