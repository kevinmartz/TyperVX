import "./footer.scss";

import React from "react";
import { locale, nativeAlert, openFile } from "../../utils";
import { useContext } from "../../context";

const AppFooter = React.memo(function AppFooter() {
  const context = useContext();
  const openSettings = () => {
    context.dispatch({
      type: "setModal",
      modal: "settings",
    });
  };
  const openHelp = () => {
    context.dispatch({
      type: "setModal",
      modal: "help",
    });
  };
  const openRepository = () => {
    const extension = ["psd", "png", "jpg", "jpeg"];
    const result = window.cep.fs.showOpenDialogEx(true, false, "Open Images", "", extension);
    if (result.err == 0) {
      const images = result.data
        .map((url) => {
          const name = url.split(/\/|\\/).pop();
          const extName = name.split(/\./).pop();
          const baseName = name.substring(0, name.length - extName.length - 1);
          return { name: name, baseName: baseName, path: url };
        })
        .sort((a, b) => a.baseName.localeCompare(b.baseName));
      context.dispatch({
        type: "setImages",
        images: images,
      });
    } else {
      console.log(result.err);
    }
  };

  const importStyleFolder = () => {
    const pathSelect = window.cep.fs.showOpenDialogEx(false, false, null, null, ["json"]);
    if (!pathSelect?.data?.[0]) return false;
    const result = window.cep.fs.readFile(pathSelect.data[0]);
    if (result.err) {
      nativeAlert(locale.errorImportStyles, locale.errorTitle, true);
    } else {
      try {
        const folder = JSON.parse(result.data);
        if (!folder) {
          nativeAlert(locale.errorFolderCreation, locale.errorTitle, true);
          return false;
        }
        const dataFolder = { name: folder.name };
        dataFolder.id = Math.random().toString(36).substring(2, 8);
        context.dispatch({ type: "saveFolder", data: dataFolder });
        const exportedStyles = folder.exportedStyles;
        exportedStyles.forEach((style) => {
          const dataStyle = { name: style.name, folder: dataFolder.id, textProps: style.textProps };
          dataStyle.id = Math.random().toString(36).substring(2, 8);
          dataStyle.edited = Date.now();
          context.dispatch({ type: "saveStyle", data: dataStyle });
        });
      } catch (error) {
        nativeAlert(locale.errorImportStyles, locale.errorTitle, true);
      }
    }
  };
  return (
    <React.Fragment>
      <span className="link" onClick={openHelp}>
        {locale.footerHelp}
      </span>
      <span className="link" onClick={openSettings}>
        {locale.footerSettings}
      </span>
      <span className="link" onClick={openRepository}>
        {locale.footerOpenRepo}
      </span>
      <span className="link link-left" onClick={importStyleFolder}>
        {locale.footerImportStyleFolder}
      </span>
    </React.Fragment>
  );
});

export default AppFooter;
