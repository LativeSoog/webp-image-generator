import { useEffect, useState } from "react";
import { useGenerateImageMutation } from "../../service/generateImage";
import S from "./FormGenerate.module.scss";
import classNames from "classnames";

export const FormGenerate = ({ setCurrentImage }) => {
  const [userQuery, setUserQuery] = useState("");
  const [parametersImage, setParametersImage] = useState({
    width: 512,
    height: 512,
    style: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isGeneratedImage, setIsGeneratedImage] = useState(false);
  const [generateImage] = useGenerateImageMutation();

  const startGenerateImage = async () => {
    setIsGeneratedImage(true);
    const response = await generateImage({
      prompt: userQuery,
      width: parametersImage.width,
      height: parametersImage.height,
      style: parametersImage.style,
    });

    try {
      if (response.data.status === "done") {
        setCurrentImage(response.data.image);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratedImage(false);
    }
  };

  const handleCheckForm = () => {
    setFormErrors({});

    if (!userQuery) {
      return setFormErrors({ ...formErrors, query: "Укажите запрос" });
    }

    if (parametersImage.width + parametersImage.height > 3072) {
      return setFormErrors({
        ...formErrors,
        size: "Общая сумма ширины и высоты не может превышать 3072 пикселей",
      });
    }

    startGenerateImage();
  };

  const handleClearForm = () => {
    setUserQuery("");
    setParametersImage({
      width: 512,
      height: 512,
      style: 0,
    });
  };

  useEffect(() => {
    if (parametersImage.height < 128 || parametersImage.width < 128) {
      setFormErrors({
        ...formErrors,
        size: "Минимальное значение ширины/высоты - 128 пикселей",
      });
    } else {
      setFormErrors({});
    }
  }, [parametersImage.height, parametersImage.width]);

  return (
    <div className={S["form"]}>
      <div className={S["form-content"]}>
        <h2 className={S["form-content__title"]}>Параметры</h2>
        <div className={S["form-parameters"]}>
          <div
            className={classNames(S["form-item"], S["form-item_full-width"])}>
            <label
              htmlFor="query"
              className={S["form-item__label"]}>
              Запрос
            </label>
            <textarea
              id="query"
              value={userQuery}
              onInput={(e) => setUserQuery(e.target.value)}
              className={classNames(
                S["form-item__input"],
                formErrors.query && S["form-item__input_error"]
              )}
            />
          </div>
          <div className={S["form-items"]}>
            <div className={S["form-item"]}>
              <label
                htmlFor="width"
                className={S["form-item__label"]}>
                Ширина (px)
              </label>
              <input
                type="number"
                id="width"
                min={128}
                value={parametersImage.width}
                onInput={(e) =>
                  setParametersImage({
                    ...parametersImage,
                    width: Number(e.target.value),
                  })
                }
                className={classNames(
                  S["form-item__input"],
                  formErrors.size && S["form-item__input_error"]
                )}
              />
            </div>
            <div className={S["form-item"]}>
              <label
                htmlFor="height"
                className={S["form-item__label"]}>
                Высота (px)
              </label>
              <input
                type="number"
                id="height"
                min={128}
                value={parametersImage.height}
                onInput={(e) =>
                  setParametersImage({
                    ...parametersImage,
                    height: Number(e.target.value),
                  })
                }
                className={classNames(
                  S["form-item__input"],
                  formErrors.size && S["form-item__input_error"]
                )}
              />
            </div>
            <div className={S["form-item"]}>
              <label
                htmlFor="style"
                className={S["form-item__label"]}>
                Стиль
              </label>
              <select
                id="style"
                className={S["form-item__input"]}
                value={parametersImage.style}
                onChange={(e) =>
                  setParametersImage({
                    ...parametersImage,
                    style: Number(e.target.value),
                  })
                }>
                <option value={0}>Стандартный</option>
                <option value={1}>Kandinsky</option>
                <option value={2}>UHD</option>
                <option value={3}>Anime</option>
              </select>
            </div>
          </div>
        </div>
        {formErrors && (
          <div className={S["form-errors"]}>
            {Object.values(formErrors).map((message, index) => (
              <p
                key={index}
                className={S["form-errors__text"]}>
                {message}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className={S["form-buttons"]}>
        {isGeneratedImage ? (
          <p>Изображение создаётся. Пожалуйста, подождите...</p>
        ) : (
          <>
            <button
              className={S["form-buttons__btn"]}
              onClick={() => handleCheckForm()}>
              Создать
            </button>
            <button
              className={classNames(
                S["form-buttons__btn"],
                S["form-buttons__btn_outline"]
              )}
              onClick={() => handleClearForm()}>
              Сбросить
            </button>
          </>
        )}
      </div>
    </div>
  );
};
