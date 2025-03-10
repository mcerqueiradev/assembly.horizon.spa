import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../../_services/userProfile.service';
import { UserService } from '../../../_services/user.service';
import { UserProfile } from '../../../_models/User/userProfile';
import { forkJoin } from 'rxjs';
import { UserModel } from '../../../_models/user';
import { AuthService } from '../../../_services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserPostService } from '../../../_services/userPost.service';
import { UserPost } from '../../../_models/Post/userPost';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  currentTab = 'posts';
  newPostContent = '';
  userProfile!: UserProfile;
  user!: UserModel;
  userPosts: UserPost[] = [];
  isOwnProfile: boolean = false;
  isEditing: boolean = false;
  profileForm: FormGroup;
  updateSuccess = false;
  isEditModalOpen = false;
  @ViewChild('fileInput') fileInput!: ElementRef;

  postForm: FormGroup;
  postMedia: File | null = null;
  @ViewChild('postFileInput') postFileInput!: ElementRef;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private userPostService: UserPostService,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      bio: [''],
      location: [''],
      website: [''],
      occupation: [''],
    });
    this.postForm = this.fb.group({
      content: [''],
      mediaFile: [null],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      this.loadUserData(userId);
      this.checkIfOwnProfile(userId);
    });
  }

  checkIfOwnProfile(profileUserId: string): void {
    const loggedUser = this.authService.getLoggedUserWithoutRedirect();
    this.isOwnProfile = loggedUser ? loggedUser.userId === profileUserId : false;
  }

  loadUserData(userId: string): void {
    forkJoin({
      profile: this.userProfileService.retrieveUserProfile(userId),
      user: this.userService.retrieve(userId),
      posts: this.userPostService.retrieveUserPosts(userId),
    }).subscribe({
      next: (response) => {
        this.userProfile = {
          id: response.profile.id,
          bio: response.profile.bio,
          profileCoverUrl: response.profile.profileCoverUrl,
          location: response.profile.location,
          website: response.profile.website,
          occupation: response.profile.occupation,
        };
        this.user = response.user;
        this.userPosts = response.posts.responses;

        console.log(this.userProfile), console.log(this.user);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  setTab(tab: string): void {
    this.currentTab = tab;
  }

  createPost(): void {
    if (this.postForm.valid) {
      const formData = new FormData();
      formData.append('Content', this.postForm.get('content')?.value);
      formData.append('UserId', this.user.id);

      if (this.postMedia) {
        formData.append('MediaFile', this.postMedia);
      }

      this.userPostService.create(formData).subscribe({
        next: (response) => {
          this.userPosts.unshift(response);
          this.postForm.reset();
          this.postMedia = null;
          // Refresh posts list or add new post to existing list
        },
        error: (error) => {
          console.error('Error creating post:', error);
        },
      });
    }
  }

  autoGrow(event: any): void {
    const element = event.target;
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  }

  getMediaPreviewUrl(): string {
    return this.postMedia ? URL.createObjectURL(this.postMedia) : '';
  }

  clearPostMedia(): void {
    this.postMedia = null;
    this.postFileInput.nativeElement.value = '';
  }

  onPostMediaSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.postMedia = file;
    }
  }

  triggerPostFileInput(): void {
    this.postFileInput.nativeElement.click();
  }

  openEditModal(): void {
    this.isEditModalOpen = true;
    this.profileForm.patchValue({
      bio: this.userProfile.bio || '',
      location: this.userProfile.location || '',
      website: this.userProfile.website || '',
      occupation: this.userProfile.occupation || '',
    });
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      this.userProfileService.updateProfile(this.userProfile.id, this.profileForm.value).subscribe({
        next: (response) => {
          this.userProfile = { ...this.userProfile, ...this.profileForm.value };
          this.closeEditModal();
          this.updateSuccess = true;
          setTimeout(() => (this.updateSuccess = false), 3000);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        },
      });
    }
  }

  updateCoverPhoto(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('ProfileCoverUpload', file);

      // Add existing profile data to FormData
      formData.append('Bio', this.userProfile.bio || '');
      formData.append('Location', this.userProfile.location || '');
      formData.append('Website', this.userProfile.website || '');
      formData.append('Occupation', this.userProfile.occupation || '');

      this.userProfileService.updateProfile(this.userProfile.id, formData).subscribe({
        next: (response) => {
          this.userProfile.profileCoverUrl = response.profileCoverUrl;
          this.updateSuccess = true;
          setTimeout(() => (this.updateSuccess = false), 3000);
        },
        error: (error) => {
          console.error('Error updating cover photo:', error);
        },
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
