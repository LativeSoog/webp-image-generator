import classNames from "classnames";
import S from "./ViewImage.module.scss";
import { useRef } from "react";

export const ViewImage = ({ currentImage, setCurrentImage }) => {
  const downloadLinkRef = useRef(null);

  const downloadImage = () => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = `data:image/webp;base64,${currentImage}`;
      downloadLinkRef.current.download = "image.webp";
      downloadLinkRef.current.click();
    }
  };

  return (
    <div className={S["wrapper"]}>
      <div className={S["view-image"]}>
        <h2 className={S["view-image__title"]}>Просмотр изображения</h2>
        <div className={S["view-image__img-wrapper"]}>
          <img
            src={`data:image/webp;base64,${currentImage}`}
            alt=""
            className={S["view-image__img"]}
          />
        </div>
        <div className={S["view-image__buttons"]}>
          <a ref={downloadLinkRef} className={S["view-image__btn_no-display"]}></a>
          <button
            className={S["view-image__btn"]}
            onClick={() => downloadImage()}>
            Сохранить
          </button>
          <button
            className={classNames(
              S["view-image__btn"],
              S["view-image__btn_outline"]
            )}
            onClick={() => setCurrentImage(false)}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
