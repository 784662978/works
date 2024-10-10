// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let adsManager;
let adsLoader;
let adDisplayContainer;
let playButton;
let videoContent;
export let adsInitialized;
let autoplayAllowed;
let autoplayRequiresMuted;
let video_content;

export function initAdsInitialized() {
  adsInitialized = false
}
export function getAdsInitialized() {
  return adsInitialized
}
/**
 * 初始化IMA设置。
 */
export function initDesktopAutoplayExample() {
  videoContent = document.getElementById('contentElement_html5_api');
  video_content = document.getElementById('video_content');
  playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    // 初始化容器。必须通过用户操作完成，其中
    //不允许自动播放。
    adDisplayContainer.initialize();
    adsInitialized = true;
    videoContent.load();
    playAds();
  });
  setUpIMA();
  // 检查是否支持自动播放。
  checkAutoplaySupport();
}

/**
 * 尝试自动播放并处理成功和失败的情况。
 */
function checkAutoplaySupport() {
  // 使用我们的内容播放器测试自动播放支持。
  const playPromise = videoContent.play();
  if (playPromise !== undefined) {
    playPromise.then(onAutoplayWithSoundSuccess).catch(onAutoplayWithSoundFail);
  }
}

/**
 * 处理自动播放成功并有声音的情况。
 */
function onAutoplayWithSoundSuccess() {
  // 如果我们在这里成功，取消静音的自动播放就可以了。
  videoContent.pause();
  autoplayAllowed = true;
  autoplayRequiresMuted = false;
  autoplayChecksResolved();
}

/**
 * 处理自动播放失败并伴有声音的情况。
 */
function onAutoplayWithSoundFail() {
  // 取消静音自动播放失败。现在尝试静音自动播放。
  checkMutedAutoplaySupport();
}

/**
 * 检查视频是否可以在静音时自动播放。
 */
function checkMutedAutoplaySupport() {
  videoContent.volume = 0;
  videoContent.muted = true;
  const playPromise = videoContent.play();
  if (playPromise !== undefined) {
    playPromise.then(onMutedAutoplaySuccess).catch(onMutedAutoplayFail);
  }
}

/**
 * 处理静音时自动播放成功的情况。
 */
function onMutedAutoplaySuccess() {
  // 如果我们做到了这一点，静音自动播放有效，但未静音自动播放无效。
  videoContent.pause();
  autoplayAllowed = true;
  autoplayRequiresMuted = true;
  autoplayChecksResolved();
}

/**
 * 处理静音时自动播放失败的情况。
 */
function onMutedAutoplayFail() {
  // Both muted and unmuted autoplay failed. Fall back to click to play.
  videoContent.volume = 1;
  videoContent.muted = false;
  autoplayAllowed = false;
  autoplayRequiresMuted = false;
  autoplayChecksResolved();
}

/**
 * 设置IMA广告显示容器、广告加载器，并发出广告请求。
 */
export function setUpIMA() {
  // 创建广告展示容器。
  createAdDisplayContainer();
  // 创建广告加载器。
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  // 收听并响应加载的广告和错误事件。
  adsLoader.addEventListener(
    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    onAdsManagerLoaded, false);
  adsLoader.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

  // 一个事件监听器，告诉SDK我们的内容视频
  // 已完成，因此SDK可以播放任何后期广告。
  videoContent.onended = contentEndedListener;
}

/**
 * 处理内容结尾并调用adsLoader.contentComplete（）
 */
function contentEndedListener() {
  videoContent.onended = null;
  if (adsLoader) {
    adsLoader.contentComplete();
  }
}

/**
 * 构建广告请求并使用它来请求广告。
 */
export function autoplayChecksResolved() {
  // 请求视频广告。

  const adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
    'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
    'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
    'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&' +
    'impl=s&correlator=';

  // 指定线性和非线性槽尺寸。这有助于SDK
  //如果返回多个创意，请选择正确的创意。
  adsRequest.linearAdSlotWidth = 640;
  adsRequest.linearAdSlotHeight = 400;

  adsRequest.nonLinearAdSlotWidth = 640;
  adsRequest.nonLinearAdSlotHeight = 150;

  adsRequest.setAdWillAutoPlay(autoplayAllowed);
  adsRequest.setAdWillPlayMuted(autoplayRequiresMuted);
  adsLoader.requestAds(adsRequest);
}

/**
 * 将“adContainer”div设置为IMA广告显示容器。
 */
function createAdDisplayContainer() {
  // 我们假设adContainer是将容纳的元素的DOM id
  //广告。
  adDisplayContainer = new google.ima.AdDisplayContainer(
    document.getElementById('adContainer'), videoContent);
}

/**
 * 加载视频内容并初始化IMA广告播放。
 */
export function playAds() {
  try {
    if (!adsInitialized) {
      adDisplayContainer.initialize();
      adsInitialized = true;
    }
    // 初始化广告管理器。此时将启动广告规则播放列表。
    adsManager.init(video_content.clientWidth, video_content.clientHeight, google.ima.ViewMode.NORMAL);
    // 呼叫播放开始显示广告。单个视频和叠加广告将
    //此时开始；根据广告规则，该调用将被忽略。
    adsManager.start();
  } catch (adError) {
    // /如果VAST响应有问题，可能会抛出错误。
    videoContent.play();
    initAdsInitialized()
  }
}

/**
 * 处理广告管理器加载并设置广告事件侦听器。
 * @param {!google.ima.AdsManagerLoadedEvent} adsManagerLoadedEvent
 */
function onAdsManagerLoaded(adsManagerLoadedEvent) {
  // 找广告经理。
  const adsRenderingSettings = new google.ima.AdsRenderingSettings();
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  // videoContent应设置为内容视频元素。
  adsManager =
    adsManagerLoadedEvent.getAdsManager(videoContent, adsRenderingSettings);
  // 如果进行静音自动播放，请将广告静音。
  const adVolume = (autoplayAllowed && autoplayRequiresMuted) ? 0 : 1;
  adsManager.setVolume(adVolume);

  // 将侦听器添加到所需的事件中。
  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
    onContentResumeRequested);
  adsManager.addEventListener(
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdEvent);

  // 如有必要，请收听任何其他活动。
  adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdEvent);
  adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdEvent);
  adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEvent);

  if (autoplayAllowed) {
    playAds();
  } else {
    playButton.style.display = 'block';
  }
}

/**
 * 处理为响应广告事件而采取的操作。
 * @param {!google.ima.AdEvent} adEvent
 */
function onAdEvent(adEvent) {
  // 从活动中检索广告。一些事件（例如，
  // ALL_ADS_CLompleted）没有关联的广告对象。
  const ad = adEvent.getAd();
  switch (adEvent.type) {
    case google.ima.AdEvent.Type.LOADED:
      // 这是为广告发送的第一个事件-有可能
      // 确定广告是视频广告还是叠加广告。
      if (!ad.isLinear()) {
        videoContent.play();
        initAdsInitialized()
      }
      break;
  }
}

/**
 * 处理广告错误。
 * @param {!google.ima.AdErrorEvent} adErrorEvent
 */
function onAdError(adErrorEvent) {
  // 处理错误记录。
  console.log(adErrorEvent.getError());
  adsManager.destroy();
  // 回到播放内容。
  videoContent.play();
  initAdsInitialized()
}

/**
 * 暂停视频内容并设置广告UI。
 */
function onContentPauseRequested() {
  videoContent.pause();
  videoContent.onended = null;
}

/**
 * 恢复视频内容并删除广告UI。
 */
function onContentResumeRequested() {
  videoContent.play();
  videoContent.onended = contentEndedListener;
  initAdsInitialized()
}
