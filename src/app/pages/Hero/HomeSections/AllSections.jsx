"use client";

import React, { useState, useEffect } from "react";
import MovieSection from "./MovieSection";
import EventSection from "./EventSection";
import WatchVideoSection from "./WatchVideoSection";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1/api';

// Dynamic Section Divider Component
const SectionDivider = ({ divider }) => {
  if (!divider) return null;
  
  const { title, subtitle, style = {} } = divider;
  
  // Build title styles
  const getTitleStyles = () => {
    if (style.titleGradientEnabled) {
      return {
        backgroundImage: `linear-gradient(to right, ${style.titleGradientFrom || '#ef4444'}, ${style.titleGradientVia || '#f97316'}, ${style.titleGradientTo || '#eab308'})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    }
    return { color: style.titleColor || '#ffffff' };
  };

  // Get font size class
  const getFontSizeClass = () => {
    const sizeMap = {
      'text-xs': 'text-xs',
      'text-sm': 'text-sm',
      'text-base': 'text-base',
      'text-lg': 'text-lg md:text-xl',
      'text-xl': 'text-xl md:text-2xl',
      'text-2xl': 'text-lg md:text-2xl',
      'text-3xl': 'text-xl md:text-3xl',
      'text-4xl': 'text-2xl md:text-4xl',
    };
    return sizeMap[style.titleFontSize] || 'text-lg md:text-2xl';
  };

  // Get font weight class
  const getFontWeightClass = () => {
    return style.titleFontWeight || 'font-bold';
  };

  return (
    <div 
      className="w-full px-4 md:px-8"
      style={{ 
        paddingTop: `${style.paddingY || 8}px`,
        paddingBottom: `${style.paddingY || 8}px`,
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div 
            className="w-full"
            style={{ 
              borderTopWidth: `${style.borderWidth || 1}px`,
              borderTopStyle: style.borderStyle || 'solid',
              borderTopColor: style.borderColor || '#374151',
            }}
          ></div>
        </div>
        <div className="relative flex justify-center">
          <div 
            className="px-6 py-2 text-center"
            style={{ backgroundColor: style.backgroundColor || '#0a0a0a' }}
          >
            <h3 
              className={`${getFontSizeClass()} ${getFontWeightClass()}`}
              style={getTitleStyles()}
            >
              {title}
            </h3>
            {subtitle && (
              <p 
                className={`${style.subtitleFontSize || 'text-xs md:text-sm'} mt-1`}
                style={{ color: style.subtitleColor || '#9ca3af' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dynamic Section Title Component
const SectionTitleWrapper = ({ sectionTitle, children }) => {
  if (!sectionTitle) return children;
  
  const { title, style = {} } = sectionTitle;
  
  // Build title styles
  const getTitleStyles = () => {
    if (style.textGradientEnabled) {
      return {
        backgroundImage: `linear-gradient(to right, ${style.gradientFrom || '#ef4444'}, ${style.gradientVia || '#f97316'}, ${style.gradientTo || '#eab308'})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    }
    return { color: style.textColor || '#ffffff' };
  };

  // Get accent styles
  const getAccentStyles = () => {
    if (!style.accentEnabled) return {};
    
    const accentStyle = {
      [`border${style.accentPosition === 'bottom' ? 'Bottom' : style.accentPosition === 'left' ? 'Left' : 'Right'}Width`]: `${style.accentWidth || 2}px`,
      [`border${style.accentPosition === 'bottom' ? 'Bottom' : style.accentPosition === 'left' ? 'Left' : 'Right'}Style`]: 'solid',
      [`border${style.accentPosition === 'bottom' ? 'Bottom' : style.accentPosition === 'left' ? 'Left' : 'Right'}Color`]: style.accentColor || '#ef4444',
    };
    return accentStyle;
  };

  // Override the title in children with dynamic title
  return React.cloneElement(children, { 
    title: title,
    titleStyle: { ...getTitleStyles(), ...getAccentStyles() },
    viewMoreLink: sectionTitle.viewMoreLink || children.props.viewMoreLink
  });
};

// Fallback data for when API is not available
const fallbackDividers = [
  { sectionKey: 'trade_movies', title: '🎬 Trade Movies', subtitle: 'Discover film rights and investment opportunities', style: {} },
  { sectionKey: 'live_events', title: '🎭 Live Events & Experiences', subtitle: 'Book your next unforgettable experience', style: {} },
  { sectionKey: 'watch_movie', title: '🎥 Watch Movie', subtitle: 'Stream the latest movies and series', style: {} },
];

const fallbackTitles = [
  { sectionKey: 'hot_rights_available', parentDivider: 'trade_movies', title: '🔥 Hot Rights Available', viewMoreLink: '/film-mart?section=hot_rights_available', style: {} },
  { sectionKey: 'profitable_picks', parentDivider: 'trade_movies', title: '💰 Profitable Picks', viewMoreLink: '/film-mart?section=profitable_picks', style: {} },
  { sectionKey: 'international_deals', parentDivider: 'trade_movies', title: '🌍 International Deals', viewMoreLink: '/film-mart?section=international_deals', style: {} },
  { sectionKey: 'indie_gems', parentDivider: 'trade_movies', title: '💎 Indie Gems', viewMoreLink: '/film-mart?section=indie_gems', style: {} },
  { sectionKey: 'trending_events', parentDivider: 'live_events', title: '🔥 Trending Events', viewMoreLink: '/events?section=trending_events', style: {} },
  { sectionKey: 'celebrity_events', parentDivider: 'live_events', title: '⭐ Celebrity Events', viewMoreLink: '/events?section=celebrity_events', style: {} },
  { sectionKey: 'exclusive_invite_only', parentDivider: 'live_events', title: '🎟️ Exclusive / Invite Only', viewMoreLink: '/events?section=exclusive_invite_only', style: {} },
  { sectionKey: 'near_you', parentDivider: 'live_events', title: '📍 Near You', viewMoreLink: '/events?section=near_you', style: {} },
  { sectionKey: 'trending_now', parentDivider: 'watch_movie', title: '🔥 Trending Now', viewMoreLink: '/watch-movies?section=trending_now', style: {} },
  { sectionKey: 'most_popular', parentDivider: 'watch_movie', title: '🏆 Most Popular', viewMoreLink: '/watch-movies?section=most_popular', style: {} },
  { sectionKey: 'exclusive_on_moviemart', parentDivider: 'watch_movie', title: '✨ Exclusive on Movie Mart', viewMoreLink: '/watch-movies?section=exclusive_on_moviemart', style: {} },
  { sectionKey: 'new_release', parentDivider: 'watch_movie', title: '🆕 New Release', viewMoreLink: '/watch-movies?section=new_release', style: {} },
];

const AllSections = () => {
  const [dividers, setDividers] = useState(fallbackDividers);
  const [titles, setTitles] = useState(fallbackTitles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSectionSettings();
  }, []);

  const fetchSectionSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/section-settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setDividers(data.data.dividers || fallbackDividers);
          setTitles(data.data.titles || fallbackTitles);
        }
      }
    } catch (error) {
      console.error('Failed to fetch section settings:', error);
      // Use fallback data on error
    } finally {
      setLoading(false);
    }
  };

  // Helper to get divider by key
  const getDivider = (key) => dividers.find(d => d.sectionKey === key);
  
  // Helper to get titles by parent divider
  const getTitlesByDivider = (dividerKey) => titles.filter(t => t.parentDivider === dividerKey);
  
  // Helper to get title by key
  const getTitle = (key) => titles.find(t => t.sectionKey === key);

  // Get section component based on parent divider
  const getSectionComponent = (sectionKey, parentDivider) => {
    const titleData = getTitle(sectionKey);
    if (!titleData || !titleData.isActive) return null;

    const props = {
      homeSection: sectionKey,
      title: titleData.title,
      viewMoreLink: titleData.viewMoreLink,
    };

    if (parentDivider === 'trade_movies') {
      return <MovieSection key={sectionKey} {...props} />;
    } else if (parentDivider === 'live_events') {
      return <EventSection key={sectionKey} {...props} />;
    } else if (parentDivider === 'watch_movie') {
      return <WatchVideoSection key={sectionKey} {...props} />;
    }
    return null;
  };

  return (
    <div className="home-sections">
      {dividers.map((divider) => {
        if (!divider.isActive && divider.isActive !== undefined) return null;
        
        const dividerTitles = getTitlesByDivider(divider.sectionKey);
        
        return (
          <React.Fragment key={divider.sectionKey}>
            <SectionDivider divider={divider} />
            {dividerTitles.map((title) => 
              getSectionComponent(title.sectionKey, divider.sectionKey)
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AllSections;
