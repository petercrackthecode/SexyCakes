//
//  CheckoutViewController.m
//  SayMile
//
//  Created by Peter Nguyen on 8/28/20.
//

#import <Foundation/Foundation.h>
#import <Stripe/Stripe.h>
#import "CheckoutViewController.h"
#import "AppDelegate.h"

@interface  CheckoutViewController ()
@end

@implementation CheckoutViewController

#pragma mark - STPAuthenticationContext
- (UIViewController *)authenticationPresentingViewController {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  return delegate.rootViewController;
}
@end
