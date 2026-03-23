import Cookie from 'js-cookie';
import sortBy from 'lodash/sortBy';
import { useEffect, useRef } from 'react';

function isAndroid() {
  const ua = navigator.userAgent;
  const isAndroid = ua.indexOf('Android') > -1;
  return isAndroid;
}

function isIOS() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  return isIOS;
}

function sleep(t: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, t));
}

function getDateTime(dateStr: string = ''): {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
} {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return {
    year,
    month,
    date: day,
    hour,
    minute,
    second,
  };
}

const isInAistroClient = () => {
  const userAgent = (navigator.userAgent || '').toLocaleLowerCase();
  return userAgent.indexOf('aistro/') > -1;
};

const getToken = () => Cookie.get('token');

const orderMap: { [key: string]: number } = {
  sun: 1,
  moon: 2,
  ascendant: 3,
  mercury: 4,
  venus: 6,
  mars: 5,
  jupiter: 7,
  saturn: 8,
  uranus: 9,
  neptune: 10,
};

const sortStars = (stars: any) => {
  return sortBy(stars, (star: { star: string }): number => {
    const item = star.star;
    return orderMap[item] || 10;
  });
};

function getStarOpacity(score: number) {
  const opacity = [];
  const maxStars = 5;

  for (let i = 0; i < maxStars; i++) {
    if (i < Math.floor(score / 20)) {
      opacity.push(1);
    } else {
      opacity.push(0.5);
    }
  }

  return opacity;
}

function getShareContent(content: string) {
  return `${content.substring(0, 100).replaceAll('<strong>', '').replaceAll('</strong>', '')}...`;
}

export function useInterval(callback: any, timeout = 1000) {
  const latestCallback = useRef(() => {});

  useEffect(() => {
    latestCallback.current = callback;
  });

  useEffect(() => {
    const timer = setInterval(() => latestCallback.current(), timeout);
    return () => clearInterval(timer);
  }, [timeout]);
}

export { isAndroid, isIOS, sleep, getDateTime, isInAistroClient, getToken, sortStars, getStarOpacity, getShareContent };
