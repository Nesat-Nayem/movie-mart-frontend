import { configureStore } from "@reduxjs/toolkit";
import { homeBannerApi } from "./homebannerApi";
import { faqApi } from "./faqApi";
import { helpCenterApi } from "./helpCenterApi";
import { privacyPolicyApi } from "./privacyPolicyApi";
import { termsConditionsApi } from "./termsConditionsApi";
import { vendorPolicyApi } from "./vendorPolicyApi";
import { becomeVendorApi } from "./becomeVendorApi";
import { subscriptionApi } from "./subscriptionApi";
import { moviesApi } from "./moviesApi";
import { eventsApi } from "./eventsApi";
import { generalSettingsApi } from "./generalSettingsApi";
import { advertisementApi } from "./advertisementApi";
import { enquiryApi } from "./enquiryApi";
import { watchVideosApi } from "./watchVideosApi";
import eventBookingReducer from "./eventBookingSlice";

export const store = configureStore({
  reducer: {
    [homeBannerApi.reducerPath]: homeBannerApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [helpCenterApi.reducerPath]: helpCenterApi.reducer,
    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [termsConditionsApi.reducerPath]: termsConditionsApi.reducer,
    [vendorPolicyApi.reducerPath]: vendorPolicyApi.reducer,
    [becomeVendorApi.reducerPath]: becomeVendorApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [generalSettingsApi.reducerPath]: generalSettingsApi.reducer,
    [advertisementApi.reducerPath]: advertisementApi.reducer,
    [enquiryApi.reducerPath]: enquiryApi.reducer,
    [watchVideosApi.reducerPath]: watchVideosApi.reducer,
    eventBooking: eventBookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      homeBannerApi.middleware,
      faqApi.middleware,
      helpCenterApi.middleware,
      privacyPolicyApi.middleware,
      termsConditionsApi.middleware,
      vendorPolicyApi.middleware,
      becomeVendorApi.middleware,
      subscriptionApi.middleware,
      moviesApi.middleware,
      eventsApi.middleware,
      generalSettingsApi.middleware,
      advertisementApi.middleware,
      enquiryApi.middleware,
      watchVideosApi.middleware
    ),
});
