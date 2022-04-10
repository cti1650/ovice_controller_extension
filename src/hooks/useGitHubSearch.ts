type Props = {
  keyword: string;
  exclusionKeyword: string;
  extensionKeyword: string;
};

export const useGitHubSearch = (props: Props) => {
  const { keyword, exclusionKeyword,extensionKeyword } = props;
  const encodedKeyword = encodeURIComponent(keyword);
  const encodedExclusionKeyword = encodeURIComponent(
    exclusionKeyword
      .split(" ")
      .map((word) => {
        if (word) {
          return "-" + word;
        }
      })
      .join(" ")
  );
  const encodedExtensionKeyword = encodeURIComponent(
    extensionKeyword
      .split(",")
      .map((word) => {
        if (word) {
          if(word.trim().indexOf(".") > 0){
            return "filename:" + word.trim();
          }else{
            return "extension:" + word.trim();
          }
        }
      })
      .join(" ")
  );
  const Open = (type: "Code" | "Packages" | "Repositories") => {
    const query = (encodedKeyword + " " + encodedExclusionKeyword + " " + encodedExtensionKeyword).trim()
    switch (type) {
      case "Code":
        window.open(
          "https://github.com/search?type=code&q=" +
          query,
          "_blank"
        );
        break;
      case "Packages":
        window.open(
          "https://github.com/search?type=registrypackages&q=" +
          query,
          "_blank"
        );
        break;
      case "Repositories":
        window.open(
          "https://github.com/search?type=repositories&q=" +
          query,
          "_blank"
        );
        break;
      default:
        alert("else");
    }
  };
  return {
    Open,
  };
};
