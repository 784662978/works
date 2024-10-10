<script>
import { ref, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useRouter, useRoute } from "vue-router";
import {
  initDesktopAutoplayExample,
  initAdsInitialized,
  getAdsInitialized
} from "../assets/js/advertise";
import "swiper/css";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    let SwiperObj;
    const router = useRouter();
    const routers = useRoute();
    let id = routers.params.id;
    let name = routers.params.name;
    let episode = ref(1);
    const initVideo = (val) => {
      let info = val;
      if (!info) {
        const ace = location.href;
        const mac = ace
          .substring(ace.indexOf("play/") + 7)
          .substring(0, ace.substring(ace.indexOf("play/") + 7).indexOf("/"));
        const idx = Number(ace.substring(ace.lastIndexOf("/") + 1));
        info = all._rawValue.filter((v) => v.id == mac)[0];
        info.index = idx;
      }
      return info;
    };
    let videoInfo = ref(
      initVideo(JSON.parse(localStorage.getItem("videoInfo")))
    );
    let videoPoster = ""; // ref(videoInfo.video[episode - 1].poster);
    let videoUrl = ref(""); // ref(videoInfo.video[episode - 1].videoUrl);
    let result = ref([]);
    let swiperIndex = ref(0);
    const isShowEpisode = ref(false);
    const onSwiper = (swiper) => {
      SwiperObj = swiper;
    };
    const onSlideChange = () => {
      console.log("slide change");
    };
    const switchList = (index) => {
      swiperIndex.value = index;
      SwiperObj.slideTo(index);
    };
    const rangeVideo = () => {
      let video = ref();
      const totalSize = 9350042;
      const chunkSize = 1000000;
      const numChunks = Math.ceil(totalSize / chunkSize);
      let index = 0;

      const assetURL = "/assets/frag_bunny.mp4";
      var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
      if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
        var mediaSource = new MediaSource();
        mediaSource.addEventListener("sourceopen", sourceOpen);
        video.src = URL.createObjectURL(mediaSource);
      } else {
        console.error("Unsupported MIME type or codec: ", mimeCodec);
      }
      function sourceOpen(e) {
        var mediaSource = e.target;
        var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        const send = () => {
          if (index >= numChunks) {
            sourceBuffer.addEventListener("updateend", function (_) {
              mediaSource.endOfStream();
            });
          } else {
            const start = index * chunkSize;
            const end = Math.min(start + chunkSize - 1, totalSize - 1);
            fetch(assetURL, {
              headers: {
                Range: `bytes=${start}-${end}`,
                responseType: "arraybuffer",
              },
            })
              .then(async (response) => {
                console.log(response);
                response = await response.arrayBuffer();
                index++;
                sourceBuffer.appendBuffer(response);
                send();
                video.play();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        };

        send();
      }
    };
    onMounted(() => {
      episode.value = Number(routers.params.episode);
      result.value = getEpisodeList(videoInfo.value.video, 49);
      videoUrl.value = videoInfo.value.video[episode.value - 1].videoUrl;
      getswiperIndex(episode.value);
      // initDesktopAutoplayExample();
    });
    watch(routers, (newRouter, oldRouter) => {
      if (newRouter) {
        // initAdsInitialized();
        // initDesktopAutoplayExample();
      }
    });
    const getEpisodeList = (data, n) => {
      return data.reduce((arr, cur, index) => {
        const num = index % n; // 取余
        const currentArr = arr[arr.length - 1]; // 当前应该插入的数组

        if (num === 0) {
          arr.push([
            {
              id: index + 1,
            },
          ]);
        } else {
          currentArr.push({
            id: index + 1,
          });
          arr[arr.length - 1] = currentArr;
        }

        return arr;
      }, []);
    };
    const goHome = () => {
      router.push("/");
    };
    const range = (start, end) => {
      return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
    };
    const switchVideo = (index) => {
      const result_list = result.value[swiperIndex.value];
      const result_id = result_list[result_list.length - 1].id;
      if (
        index !== 0 &&
        (index + 1 <= videoInfo.value.video.length ||
          index === videoInfo.value.video.length)
      ) {
        episode.value = index;
        if (index > result_id) {
          swiperIndex.value = swiperIndex.value + 1;
          SwiperObj.slideTo(swiperIndex.value);
        } else if (index < result_list[0].id) {
          swiperIndex.value = swiperIndex.value - 1;
          SwiperObj.slideTo(swiperIndex.value);
        }
        videoUrl.value = videoInfo.value.video[index - 1].videoUrl;
        router.push(
          `/play/${videoInfo.value.id}/${videoInfo.value.name}/${index}`
        );
      }
    };
    const playEnd = () => {
      switchVideo(
        episode.value === videoInfo.value.video.length
          ? videoInfo.value.video.length
          : episode.value + 1
      );
    };

    const swiperVideoButton = (type) => {
      switchVideo(type === "prev" ? episode.value - 1 : episode.value + 1);
    };
    const getswiperIndex = (episode) => {
      const resultList = result.value;
      resultList.forEach((list, index) => {
        list.forEach((item) => {
          if (episode === item.id) {
            swiperIndex.value = index;
            SwiperObj.slideTo(index);
          }
        });
      });
    };
    return {
      SwiperObj,
      onSwiper,
      onSlideChange,
      switchList,
      rangeVideo,
      onMounted,
      goHome,
      router,
      id,
      name,
      episode,
      videoInfo,
      initVideo,
      videoPoster,
      videoUrl,
      getEpisodeList,
      result,
      swiperIndex,
      range,
      switchVideo,
      isShowEpisode,
      playEnd,
      swiperVideoButton,
      getswiperIndex,
      initDesktopAutoplayExample,
      initAdsInitialized,
      watch,
      getAdsInitialized
    };
  },
};
</script>
<template>
  <div class="play-video">
    <div class="play-content">
      <div class="page-close" @click="goHome">
        <span role="img" class="anticon"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 56 56"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            class=""
          >
            <g transform="translate(-1148 -291)">
              <circle
                cx="28"
                cy="28"
                r="28"
                style="fill: #fff; opacity: 0.16"
                transform="translate(1148 291)"
              ></circle>
              <path
                d="m30.857 41.946 5.7-5.7a.747.747 0 0 0 0-1.05l-.031-.031a.746.746 0 0 0-1.05 0l-5.7 5.71-5.7-5.71a.746.746 0 0 0-1.05 0l-.026.029a.733.733 0 0 0 0 1.05l5.7 5.7-5.7 5.7a.747.747 0 0 0 0 1.05l.031.031a.746.746 0 0 0 1.05 0l5.7-5.7 5.7 5.7a.746.746 0 0 0 1.05 0l.031-.031a.747.747 0 0 0 0-1.05Z"
                style="fill: #fff"
                transform="translate(1146.227 277.053)"
              ></path>
            </g></svg
        ></span>
      </div>
      <div class="video-content" id="video_content">
        <div class="video-content-container">
          <div class="video-play-switch">
            <div class="prev" @click="swiperVideoButton('prev')">
              <span role="img" class="anticon"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 56 56"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  class=""
                >
                  <defs></defs>
                  <path
                    d="M28 0A28 28 0 1 1 0 28 28 28 0 0 1 28 0"
                    style="fill: rgb(255, 255, 255); opacity: 0.16"
                  ></path>
                  <path
                    d="M0 0h23.333v23.333H0z"
                    transform="rotate(90 11.666 28)"
                    style="fill: none"
                  ></path>
                  <path
                    d="M27.019 23.199a1.064 1.064 0 0 0 .3.727l8.272 8.435a1.015 1.015 0 0 0 1.44.01 1.039 1.039 0 0 0 .01-1.454l-8.272-8.435a1.015 1.015 0 0 0-1.44-.01.942.942 0 0 0-.31.727"
                    class="icon_arrow_top_svg__c"
                  ></path>
                  <path
                    d="M18.669 31.541a1.064 1.064 0 0 0 .3.727 1.014 1.014 0 0 0 1.44.01l8.354-8.352a1.039 1.039 0 0 0 .01-1.454 1.015 1.015 0 0 0-1.44-.01l-8.354 8.352a1.013 1.013 0 0 0-.31.727"
                    class="icon_arrow_top_svg__c"
                  ></path></svg
              ></span>
            </div>
            <div class="next" @click="swiperVideoButton('next')">
              <span role="img" class="anticon"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 56 56"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  class=""
                >
                  <defs></defs>
                  <path
                    d="M28 0A28 28 0 1 1 0 28 28 28 0 0 1 28 0"
                    style="fill: rgb(255, 255, 255); opacity: 0.16"
                  ></path>
                  <path
                    d="M0 0h23.333v23.333H0z"
                    transform="rotate(-90 28 11.667)"
                    style="fill: none"
                  ></path>
                  <path
                    d="M27.02 32.802a1.064 1.064 0 0 1 .3-.727l8.27-8.435a1.015 1.015 0 0 1 1.44-.01 1.039 1.039 0 0 1 .01 1.454l-8.271 8.435a1.015 1.015 0 0 1-1.44.01.942.942 0 0 1-.309-.727"
                    class="icon_arrow_bottom_svg__c"
                  ></path>
                  <path
                    d="M18.666 24.46a1.063 1.063 0 0 1 .3-.726 1.014 1.014 0 0 1 1.44-.01l8.353 8.351a1.039 1.039 0 0 1 .01 1.454 1.015 1.015 0 0 1-1.44.01l-8.354-8.352a1.013 1.013 0 0 1-.309-.727"
                    class="icon_arrow_bottom_svg__c"
                  ></path></svg
              ></span>
            </div>
          </div>
          <div class="video-view">
            <video-player
              id="contentElement"
              class="video-player vjs-theme-forest"
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                outline: none;
              "
              :src="videoUrl"
              controls
              autoplay="muted"
              @ended="playEnd"
            />
            <!-- <video
              id="contentElement"
              src=""
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                outline: none;
              "
            /> -->
            <!-- <button id="playButton">Play</button> -->
          </div>
          <!-- <div id="adContainer" v-show="!getAdsInitialized()"></div> -->
        </div>
      </div>
      <div class="video-info">
        <div class="video-info-content">
          <h3 class="video-title">Plot of {{ videoInfo.name }}</h3>
          <p class="video-p">
            {{ videoInfo.content }}
          </p>
          <div class="video-episodes">
            <h3 class="video-title">Plot of {{ videoInfo.name }}</h3>
            <div
              class="video-episode-number"
              @click="isShowEpisode = !isShowEpisode"
            >
              <div>
                Episode （{{ episode }}/{{ videoInfo.video.length || 1 }})
              </div>
              <div class="more">
                <span>Completed</span>
                <div :class="[isShowEpisode?'more_top':'', 'more_icon']">
                  <span
                    style="
                      box-sizing: border-box;
                      display: inline-block;
                      overflow: hidden;
                      width: initial;
                      height: initial;
                      background: none;
                      opacity: 1;
                      border: 0px;
                      margin: 0px;
                      padding: 0px;
                      position: relative;
                      max-width: 100%;
                    "
                    ><span
                      style="
                        box-sizing: border-box;
                        display: block;
                        width: initial;
                        height: initial;
                        background: none;
                        opacity: 1;
                        border: 0px;
                        margin: 0px;
                        padding: 0px;
                        max-width: 100%;
                      "
                      ><img
                        alt=""
                        aria-hidden="true"
                        src="../assets/img/prow.webp"
                        style="
                          display: block;
                          max-width: 100%;
                          width: initial;
                          height: initial;
                          background: none;
                          opacity: 1;
                          border: 0px;
                          margin: 0px;
                          padding: 0px;
                        " /></span
                  ></span>
                </div>
              </div>
            </div>
            <div class="video-episode-list" v-show="isShowEpisode">
              <div class="episode-list-tabs">
                <div
                  :class="swiperIndex === index ? 'active' : ''"
                  @click="switchList(index)"
                  v-for="(item, index) in result"
                  :key="index"
                >
                  {{ item[0].id }}-{{ item[item.length - 1].id }}
                </div>
              </div>
              <div class="episode-list-swiper">
                <swiper
                  :slides-per-view="1"
                  :simulateTouch="false"
                  @swiper="onSwiper"
                  @slideChange="onSlideChange"
                >
                  <swiper-slide v-for="(item, index) in result" :key="index">
                    <div
                      :class="[
                        'swiper-tabs-box',
                        episode === num ? 'active' : '',
                      ]"
                      v-for="num in item"
                      :key="num"
                    >
                      <span
                        v-if="episode !== num.id"
                        style="width: 56px; text-align: center"
                        @click="switchVideo(num.id)"
                        ><span style="font-size: 16px">{{ num.id }}</span></span
                      >
                      <span class="active_play" v-else>
                        <img src="../assets/img/player.gif" />
                      </span>
                    </div>
                  </swiper-slide>
                </swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.more_top {
  transform: rotate(180deg);
}
.play-video {
  min-height: 100vh;
  background-color: #000;
  position: relative;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 100;
}
.play-content {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  min-width: 1200px;
  -webkit-box-pack: right;
  -webkit-justify-content: right;
  justify-content: right;
  overflow: hidden;
}
.page-close {
  /* width: 56px;
  height: 56px;
  border-radius: 50%;
  position: absolute;
  top: 30px;
  left: 30px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  z-index: 300;
  font-size: 56px;
  cursor: pointer; */

  position: relative;
  width: 56px;
  height: 56px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  z-index: 300;
  font-size: 56px;

  position: absolute;
  top: 30px;
  left: 30px;
}
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.anticon svg {
  display: inline-block;
}
.video-content {
  background-color: #000;
  position: relative;
  width: 100%;
  height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
}
.video-content-container {
  min-width: 200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
}
.icon_arrow_top_svg__c {
  fill: #fff;
}
.video-play-switch {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 99;
}
.video-play-switch > div {
  position: relative;
  width: 56px;
  height: 56px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
.prev {
  margin-bottom: 30px;
  font-size: 56px;
}
.next {
  font-size: 56px;
}

.video-view {
  width: 720px;
  height: 100%;
  /* height: 1280px; */
  background: rgb(0, 0, 0);
  position: relative;
  margin: 0px auto;
}

#adContainer {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100vh;
}

.video-info {
  border-left-style: solid;
  border-color: hsla(0, 0%, 100%, 0.2);
  border-left-width: 1px;
  width: 480px;
  height: 100vh;
}
.video-info-content {
  padding-top: 36px;
  padding-right: 46px;
  padding-left: 58px;
  padding-bottom: 30px;
  overflow-y: auto;
  width: 480px;
  height: 100%;
}
.video-title {
  font-size: 18px;
  overflow-wrap: break-word;
  margin-bottom: 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
.video-p {
  font-family: Sofia Pro-Medium;
  color: hsla(0, 0%, 100%, 0.5);
  font-size: 14px;
  overflow-wrap: break-word;
  overflow: auto;
  max-height: 360px;
}
.video-episodes {
  padding-top: 20px;
  border-top-style: solid;
  border-top-color: hsla(0, 0%, 100%, 0.2);
  border-top-width: 1px;
  margin-top: 20px;
}
.video-episode-number {
  padding-right: 16px;
  padding-left: 20px;
  background-color: hsla(0, 0%, 100%, 0.08);
  border-radius: 6px;
  cursor: pointer;
  height: 42px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}
.video-episode-number > div {
  font-size: 14px;
}
.more {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  opacity: 0.5;
}
.more > div {
  width: 20px;
}

.episode-list-tabs {
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  color: hsla(0, 0%, 100%, 0.5);
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
.episode-list-tabs > div {
  margin-left: 25px;
  min-width: 35px;
  white-space: nowrap;
  font-size: 16px;
  text-align: center;
}
.episode-list-tabs > div:first-child {
  margin-left: 0;
}
.episode-list-tabs > div.active {
  color: #e83a57;
  position: relative;
}
.episode-list-tabs > div.active::before {
  content: " ";
  position: absolute;
  bottom: -8px;
  left: 50%;
  margin-left: -10px;
  width: 20px;
  height: 3px;
  background: #e83a57;
  border-radius: 2px 2px 2px 2px;
}
.episode-list-swiper {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  z-index: 1;
  display: block;
  touch-action: pan-y;
  width: 376px;
}
.episode-list-swiper .swiper {
  width: 376px;
}
.episode-list-swiper .swiper-slide {
  min-width: 376px;
  margin-top: 23px;
  display: grid;
  grid-template-columns: repeat(6, 56px);
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  overflow: hidden;
  touch-action: pan-y;
}
.swiper-tabs-box {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  width: 56px;
  height: 42px;
  background: hsla(0, 0%, 100%, 0.16);
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  border-radius: 6px 6px 6px 6px;
  position: relative;
}
.swiper-tabs-box.active {
  color: #e83a57;
  background: #000;
  border: 1px solid hsla(0, 0%, 100%, 0.42);
}
.active_play {
  box-sizing: border-box;
  display: inline-block;
  overflow: hidden;
  width: initial;
  height: initial;
  background: none;
  opacity: 1;
  border: 0px;
  margin: 0px;
  padding: 0px;
  position: relative;
  max-width: 100%;
}
.active_play img {
  display: block;
  max-width: 100%;
  width: initial;
  height: initial;
  background: none;
  opacity: 1;
  border: 0px;
  margin: 0px;
  padding: 0px;
}
@media (max-width: 746px) {
  .play-video {
    position: initial;
  }
  .play-content {
    min-width: auto;
    display: block;
    overflow: auto;
  }
  .video-content {
    height: 60vh;
  }
  .page-close {
    left: 0px;
    top: 30px;
    font-size: 36px;
    display: none;
  }
  .video-content-container {
    min-width: 100%;
  }
  .video-view {
    width: 100%;
  }
  .video-play-switch {
    bottom: 50px;
    right: 10px;
  }
  .video-play-switch > div {
    width: 30px;
    height: 30px;
    font-size: 30px;
  }
  .prev {
    margin-bottom: 10px;
  }
  #adContainer {
    height: 60vh;
    min-height: auto;
  }
  .video-info {
    width: 100%;
    height: auto;
    overflow-x: hidden;
    margin-bottom: 5rem;
  }
  .video-info-content {
    width: 100%;
    padding: 10px 20px;
    /* padding-top: 16px;
    padding-right: 26px;
    padding-left: 38px;
    padding-bottom: 10px; */
  }
  .episode-list-swiper {
    width: 100%;
  }
  .episode-list-swiper .swiper {
    width: auto;
  }
  .episode-list-swiper .swiper-slide {
    min-width: 100%;
  }
}
@media (max-width: 400px) {
  .episode-list-swiper .swiper-slide {
    grid-template-columns: repeat(5, 56px);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
  }
}
</style>