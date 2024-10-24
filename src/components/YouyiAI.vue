<template>
  <div class="frame-container">
    <div class="iframe-header">
      <div class="header-layer">
        <img src="../assets/AILogo.png" alt="" class="logo" />
        <a href="/login" class="get-started">Get started</a>
      </div>
    </div>
    <div class="iframe-main">
      <div class="iframe-main-content">
        <div class="content-big-title">AIGID</div>
        <div class="content-small-title">
          Artificial Intelligence Generated Industrial Design
        </div>
        <div class="carousel-iframe">
          <div class="carousel-iframe-inner">
            <el-carousel trigger="click" arrow="never" height="725px">
              <el-carousel-item
                v-for="item in carouselImages"
                :key="item"
                style="border-radius: 8px"
              >
                <div>
                  <img :src="item.imgsrc" alt="" style="height: 725px" />
                  <div class="mask-layer">
                    <div class="carousel-text">
                      <div class="text-title">{{ item.bigTitle }}</div>
                      <div class="text-describe">
                        {{ item.smallTitle }}
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
    </div>
    <div class="trustedby-logos">
      <div class="trustby-text">Trusted by</div>
      <div class="logos-container">
        <section>
          <ul>
            <li><img src="../assets/logos/Robam.png" alt="" /></li>
            <li><img src="../assets/logos/UE.jpg" alt="" /></li>
            <li>
              <img
                src="../assets/logos/Middle-zju.png"
                alt=""
                style="width: 60px"
              />
            </li>
            <li><img src="../assets/logos/Zeekr.png" alt="" /></li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import carouselimage1 from "../assets/carouselimage1.png";
import carouselimage2 from "../assets/carouselimage2.png";
import carouselimage3 from "../assets/carouselimage3.png";
import carouselimage4 from "../assets/carouselimage4.png";
export default {
  name: "YouyiAI",
  data() {
    return {
      carouselImages: [
        {
          imgsrc: carouselimage1,
          bigTitle: "面向厨电产品的AIGID方案生成",
          smallTitle:
            "该工具专注于厨电产品领域的智能化设计方案生成，通过大规模数据驱动的生成模型，自动化生成符合市场趋势与用户需求的多维设计方案，涵盖从美学风格到功能布局的全方位智能设计支持。通过AI技术提升设计过程中的效率与创新性，实现设计从灵感捕捉到方案落地的全链路智能优化，帮助设计师在造型创意阶段减少重复工作，加速产品研发迭代。",
        },
        {
          imgsrc: carouselimage2,
          bigTitle: "面向办公座椅的AIGID方案生成",
          smallTitle:
            "该工具专注于办公座椅的造型设计，基于AIGID（人工智能生成的工业设计）技术，通过输入基本的设计需求，如风格、代表性造型和，自动生成多样化的造型方案。设计师可以通过工具快速探索不同的椅子造型选项，借助其智能生成能力，快速迭代和优化设计。该工具旨在提高设计效率，帮助设计师在造型创意阶段减少重复工作，并提供丰富的设计灵感来源。",
        },
        {
          imgsrc: carouselimage3,
          bigTitle: "面向汽车的AIGID方案生成",
          smallTitle:
            "该工具专注于汽车外观和内饰设计，基于AIGID技术，通过输入设计需求如风格、造型和功能，自动生成多样化的方案，帮助设计师快速探索不同的设计选项。工具涵盖车身外形和内饰布局，支持从整体造型到细节优化的设计生成，满足不同风格和功能需求。通过智能生成和快速迭代，该工具可提升设计效率，减少重复性工作，激发设计灵感，为汽车外观和内饰设计提供高效的创意支持。",
        },
        {
          imgsrc: carouselimage4,
          bigTitle: "面向军工产品的AIGID方案生成",
          smallTitle:
            "该工具专注于军工产品的外观和内部方舱设计，基于AIGID技术，通过输入具体的设计需求如功能要求、整体布局或大致草图，自动生成多样化的方案。帮助设计师快速探索不同的设计方案，满足各种复杂的功能性和安全性需求。工具涵盖整体外形、内部布局以及部分组件的设计生成，从初步概念到细节优化的全过程中提供支持。通过智能生成和快速迭代，该工具可显著提升设计效率，减少重复性工作，并激发创新思维，为军工产品外观和内部结构设计提供高效的创意支持。",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.frame-container {
  align-content: center;
  align-content: center;
  align-items: center;
  background-color: #fcf5e5;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 0px;
  height: min-content;
  justify-content: flex-start;
  overflow: visible;
  padding: 0;
  position: relative;
  //   width: 1200px;
  width: 100%;
  min-height: 100vh;
  .iframe-header {
    background-color: #fcf5e5;
    flex: none;
    height: 56px;
    left: 0;
    overflow: visible;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;
    .header-layer {
      //   width: 100%;
      //   height: 100%;
      opacity: 1;
      border-bottom: solid 1px rgba(148, 148, 148, 0.45);

      align-content: center;
      align-items: center;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 24px;
      justify-content: space-between;
      padding: 0px 4px 0px 24px;
      position: relative;
      .get-started {
        background-color: rgb(106, 106, 242);
        border-radius: 12px;
        opacity: 1;
        align-content: center;
        align-items: center;

        border-radius: 8px;
        display: flex;
        flex: none;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 10px;
        // height: 40px;
        justify-content: center;
        overflow: visible;
        padding: 12px 20px;
        position: relative;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
        color: #fff;
      }
      .logo {
        height: 56px;
      }
    }
  }
  .iframe-main {
    align-content: center;
    align-items: center;
    background-color: #fcf5e5;
    display: flex;
    flex: none;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 8px;
    height: min-content;
    justify-content: center;
    // overflow: hidden;
    padding: 120px 40px 0;
    position: relative;
    width: 100%;
    .iframe-main-content {
      align-content: center;
      align-items: center;
      display: flex;
      flex: none;
      flex-direction: column;
      flex-wrap: nowrap;
      gap: 33px;
      height: 1058px; //998px
      justify-content: flex-start;
      //   overflow: hidden;
      padding: 0;
      position: relative;
      width: 1043px;
      .content-big-title {
        align-content: center;
        align-items: center;
        display: flex;
        flex: none;
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 0px;
        height: min-content;
        justify-content: center;
        overflow: hidden;
        padding: 0;
        position: relative;
        // width: min-content;
        width: 663px;
        font-size: 124px;
        color: rgb(5, 5, 5);
      }
      .content-small-title {
        outline: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-shrink: 0;
        transform: none;
        font-size: 25px;
        color: rgb(5, 5, 5);
      }
      .carousel-iframe {
        background-color: #efe9da;
        border-radius: 24px;
        flex: none;
        height: 73%; //61%
        overflow: hidden;
        position: relative;
        width: 65%; //98%
        will-change: var(--framer-will-change-override, transform);
        .carousel-iframe-inner {
          flex: none;
          height: auto;
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 95%;

          .mask-layer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 74%),
              rgba(21, 21, 23, 0) 46%,
              rgba(255, 255, 255, 0)
            );
            .carousel-text {
              position: absolute;
              left: 24px;
              right: 24px;
              bottom: 78px;
              color: #fff;
              .text-title {
                font-family: AliMedium;
                font-size: 40px;
              }
              .text-describe {
                margin-top: 24px;
                font-family: AliRegular;
                font-size: 12px;
              }
            }
          }
          ::v-deep .el-carousel__indicators--horizontal {
            transform: translateX(0);
            left: 20px;
            bottom: 18px;
            .el-carousel__button {
              width: 43px;
              height: 4px;
              border-radius: 2px;
              background-color: #9e9e9e;
            }
          }
        }
      }
    }
  }
  .trustedby-logos {
    padding-top: 80px;
    align-content: center;
    align-items: center;
    background-color: #fcf5e5;
    display: flex;
    flex: none;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 0px;
    height: min-content;
    justify-content: center;
    overflow: hidden;
    padding: 0 40px;
    position: relative;
    width: 100%;
    .trustby-text {
      outline: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      flex-shrink: 0;
      transform: none;
      font-size: 30px;
      color: rgba(5, 5, 5, 0.26);
      padding-bottom: 20px;
    }
    .logos-container {
      flex: none;
      height: 99px;
      opacity: 0.32;
      position: relative;
      width: 1120px;
      padding-bottom: 120px;
      section {
        display: flex;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        place-items: center;
        margin: 0px;
        padding: 10px;
        list-style-type: none;
        opacity: 1;
        // mask-image: linear-gradient(
        //   to right,
        //   rgba(0, 0, 0, 0) 0%,
        //   rgb(0, 0, 0) 12.5%,
        //   rgb(0, 0, 0) 87.5%,
        //   rgba(0, 0, 0, 0) 100%
        // );
        overflow: hidden;
        ul {
          display: flex;
          justify-content: space-around;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          place-items: center;
          margin: 0;
          padding: 0;
          list-style-type: none;
          text-indent: none;
          gap: 70px;
          position: relative;
          flex-direction: row;
          will-change: transform;
          transform: translateX(-0px);
          img {
            width: 120px;
          }
        }
      }
    }
  }
}
</style>