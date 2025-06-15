/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    // loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    // loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // {
  //   path: 'account-info',
  //   loadChildren: () => import('./pages/backup/account-info/account-info.module').then(m => m.AccountInfoPageModule)
  // },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./pages/backup/auth/auth.module').then(m => m.AuthPageModule)
  // },
  // {
  //   path: 'bookings',
  //   loadChildren: () => import('./pages/backup/bookings/bookings.module').then(m => m.BookingsPageModule)
  // },
  // {
  //   path: 'bookmarks',
  //   loadChildren: () => import('./pages/backup/bookmarks/bookmarks.module').then(m => m.BookmarksPageModule)
  // },
  // {
  //   path: 'cancel-booking',
  //   loadChildren: () => import('./pages/backup/cancel-booking/cancel-booking.module').then(m => m.CancelBookingPageModule)
  // }, 
  {
    path: 'cancel-modal',
    loadChildren: () => import('./pages/backup/cancel-modal/cancel-modal.module').then(m => m.CancelModalPageModule)
  },
  {
    path: 'boc-modal',
    loadChildren: () => import('./pages/boc-modal/boc-modal.module').then(m => m.BocModalPageModule)
  },
  // {
  //   path: 'cancel-success-modal',
  //   loadChildren: () => import('./pages/backup/cancel-success-modal/cancel-success-modal.module').then(m => m.CancelSuccessModalPageModule)
  // },
  // {
  //   path: 'chats',
  //   loadChildren: () => import('./pages/backup/chats/chats.module').then(m => m.ChatsPageModule)
  // },
  {
    path: 'confirm-payments',
    loadChildren: () => import('./pages/backup/confirm-payments/confirm-payments.module').then(m => m.ConfirmPaymentsPageModule)
  },
  // {
  //   path: 'e-receipt',
  //   loadChildren: () => import('./pages/backup/e-receipt/e-receipt.module').then(m => m.EReceiptPageModule)
  // },
  // {
  //   path: 'explore',
  //   loadChildren: () => import('./pages/backup/explore/explore.module').then(m => m.ExplorePageModule)
  // },
  // {
  //   path: 'gallery-list',
  //   loadChildren: () => import('./pages/backup/gallery-list/gallery-list.module').then(m => m.GalleryListPageModule)
  // },
  {
    path: 'help',
    loadChildren: () => import('./pages/backup/help/help.module').then(m => m.HelpPageModule)
  },
  // {
  //   path: 'home-backup',
  //   loadChildren: () => import('./pages/backup/home-backup/home-backup.module').then(m => m.HomeBackupPageModule)
  // },
  // {
  //   path: 'inbox',
  //   loadChildren: () => import('./pages/backup/inbox/inbox.module').then(m => m.InboxPageModule)
  // },
  {
    path: 'invite-friends',
    loadChildren: () => import('./pages/backup/invite-friends/invite-friends.module').then(m => m.InviteFriendsPageModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('./pages/backup/languages/languages.module').then(m => m.LanguagesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'notification-settings',
    loadChildren: () => import('./pages/backup/notification-settings/notification-settings.module').then(m => m.NotificationSettingsPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/backup/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  // {
  //   path: 'package-details',
  //   loadChildren: () => import('./pages/backup/package-details/package-details.module').then(m => m.PackageDetailsPageModule)
  // },
  // {
  //   path: 'packages-list',
  //   loadChildren: () => import('./pages/backup/packages-list/packages-list.module').then(m => m.PackagesListPageModule)
  // },
  // {
  //   path: 'payments',
  //   loadChildren: () => import('./pages/backup/payments/payments.module').then(m => m.PaymentsPageModule)
  // },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  // {
  //   path: 'register',
  //   loadChildren: () => import('./pages/backup/register/register.module').then(m => m.RegisterPageModule)
  // },
  // {
  //   path: 'remove-bookmark',
  //   loadChildren: () => import('./pages/backup/remove-bookmark/remove-bookmark.module').then(m => m.RemoveBookmarkPageModule)
  // },
  // {
  //   path: 'reset-password',
  //   loadChildren: () => import('./pages/backup/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  // },
  // {
  //   path: 'review-list',
  //   loadChildren: () => import('./pages/backup/review-list/review-list.module').then(m => m.ReviewListPageModule)
  // },
  // {
  //   path: 'salon-info',
  //   loadChildren: () => import('./pages/backup/salon-info/salon-info.module').then(m => m.SalonInfoPageModule)
  // },
  // {
  //   path: 'salon-list',
  //   loadChildren: () => import('./pages/backup/salon-list/salon-list.module').then(m => m.SalonListPageModule)
  // },
  {
    path: 'security-settings',
    loadChildren: () => import('./pages/backup/security-settings/security-settings.module').then(m => m.SecuritySettingsPageModule)
  },
  // {
  //   path: 'select-slot',
  //   loadChildren: () => import('./pages/backup/select-slot/select-slot.module').then(m => m.SelectSlotPageModule)
  // },
  // {
  //   path: 'service-details',
  //   loadChildren: () => import('./pages/backup/service-details/service-details.module').then(m => m.ServiceDetailsPageModule)
  // },
  // {
  //   path: 'services-list',
  //   loadChildren: () => import('./pages/backup/services-list/services-list.module').then(m => m.ServicesListPageModule)
  // },
  // {
  //   path: 'specialist',
  //   loadChildren: () => import('./pages/backup/specialist/specialist.module').then(m => m.SpecialistPageModule)
  // },
  // {
  //   path: 'success',
  //   loadChildren: () => import('./pages/backup/success/success.module').then(m => m.SuccessPageModule)
  // },
  {
    path: 'success-payment',
    loadChildren: () => import('./pages/backup/success-payment/success-payment.module').then(m => m.SuccessPaymentPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'loading',
    loadChildren: () => import('./pages/loading/loading.module').then( m => m.LoadingPageModule)
  },
  {
    path: 'loading-detail',
    loadChildren: () => import('./pages/loading-detail/loading-detail.module').then( m => m.LoadingDetailPageModule)
  },
  {
    path: 'ride',
    loadChildren: () => import('./pages/ride/ride.module').then( m => m.RidePageModule)
  },
  {
    path: 'job-detail',
    loadChildren: () => import('./pages/job-detail/job-detail.module').then( m => m.JobDetailPageModule)
  },
  {
    path: 'checklist',
    loadChildren: () => import('./pages/checklist/checklist.module').then( m => m.ChecklistPageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./pages/signature/signature.module').then( m => m.SignaturePageModule)
  },
  {
    path: 'loading-detail-bbc',
    loadChildren: () => import('./pages/loading-detail-bbc/loading-detail-bbc.module').then( m => m.LoadingDetailBbcPageModule)
  },
  {
    path: 'form-modal',
    loadChildren: () => import('./pages/form-modal/form-modal.module').then( m => m.FormModalPageModule)
  },
  {
    path: 'push-notification',
    loadChildren: () => import('./pages/push-notification/push-notification.module').then( m => m.PushNotificationPageModule)
  },
  {
    path: 'job-signature',
    loadChildren: () => import('./pages/job-signature/job-signature.module').then( m => m.JobSignaturePageModule)
  },
  {
    path: 'job-review',
    loadChildren: () => import('./pages/job-review/job-review.module').then( m => m.JobReviewPageModule)
  },
  {
    path: 'job-review-supervisor',
    loadChildren: () => import('./pages/job-review-supervisor/job-review-supervisor.module').then( m => m.JobReviewSupervisorPageModule)
  },
  {
    path: 'job-finish',
    loadChildren: () => import('./pages/job-finish/job-finish.module').then( m => m.JobFinishPageModule)
  },
  {
    path: 'countdown-modal',
    loadChildren: () => import('./pages/countdown-modal/countdown-modal.module').then( m => m.CountdownModalPageModule)
  },
  {
    path: 'job-review-cos',
    loadChildren: () => import('./pages/job-review-cos/job-review-cos.module').then( m => m.JobReviewCosPageModule)
  },
  {
    path: 'review-modal',
    loadChildren: () => import('./pages/review-modal/review-modal.module').then( m => m.ReviewModalPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
