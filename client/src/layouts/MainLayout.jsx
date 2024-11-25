import { useState } from "react";
import { FormGenerate } from "../components/FormGenerate/FormGenerate";
import { ViewImage } from "../components/ViewImage/ViewImage";
import S from "./MainLayout.module.scss";

export const MainLayout = () => {
  const [currentImage, setCurrentImage] = useState(false);

  return (
    <>
      {currentImage && (
        <ViewImage
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
        />
      )}

      <div className={S["wrapper"]}>
        <div className={S["content"]}>
          <div className={S["content-top"]}>
            <h1 className={S["content-top__title"]}>Создание WebP-изображения</h1>
            <p className={S["content-top__text"]}>
              Укажите запрос, выберите параметры и получите готовое изображение в формате WebP
            </p>
          </div>
          <div className={S["content-body"]}>
            <FormGenerate setCurrentImage={setCurrentImage} />
          </div>
        </div>
      </div>
    </>
  );
};
