import { useEffect, useMemo } from "react";

import { useMantineTheme } from "@mantine/core";

type CSSValue = string | number;
type StyleRule = {
  [property: string]: CSSValue | StyleRule | undefined;
};
type StyleRules = Record<string, StyleRule>;
type StyleFactory<Props, Styles extends StyleRules> = (
  theme: ReturnType<typeof useMantineTheme>,
  params: Props,
) => Styles;

const kebabCase = (value: string) => value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const serializeRule = (selector: string, rule: StyleRule): string => {
  const declarations: string[] = [];
  const nestedRules: string[] = [];

  Object.entries(rule).forEach(([property, value]) => {
    if (value === undefined) {
      return;
    }

    if (typeof value === "object") {
      if (property.startsWith("@media")) {
        nestedRules.push(`${property}{${serializeRule(selector, value)}}`);
        return;
      }

      const nestedSelector = property.includes("&")
        ? property.replace(/&/g, selector)
        : `${selector} ${property}`;
      nestedRules.push(serializeRule(nestedSelector, value));
      return;
    }

    declarations.push(`${kebabCase(property)}:${value}`);
  });

  const baseRule = declarations.length ? `${selector}{${declarations.join(";")}}` : "";
  return [baseRule, ...nestedRules].filter(Boolean).join("");
};

export const createStyles =
  <Props = void, Styles extends StyleRules = StyleRules>(factory: StyleFactory<Props, Styles>) =>
  (params?: Props) => {
    const theme = useMantineTheme();

    const styles = useMemo(() => factory(theme, params as Props), [theme, params]);

    const { classes, cssText } = useMemo(() => {
      const seed = hashString(JSON.stringify(styles));
      const styleKeys = Object.keys(styles) as Array<keyof Styles & string>;
      const generatedClasses = styleKeys.reduce<Record<keyof Styles, string>>(
        (accumulator, key) => {
          accumulator[key] = `aip-${key}-${seed}`;
          return accumulator;
        },
        {} as Record<keyof Styles, string>,
      );

      const generatedCss = Object.entries(styles)
        .map(([key, rule]) => serializeRule(`.${generatedClasses[key as keyof Styles]}`, rule))
        .join("");

      return { classes: generatedClasses, cssText: generatedCss };
    }, [styles]);

    useEffect(() => {
      if (!cssText || typeof document === "undefined") {
        return undefined;
      }

      const styleId = `aip-create-styles-${hashString(cssText)}`;
      if (document.getElementById(styleId)) {
        return undefined;
      }

      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = cssText;
      document.head.appendChild(styleElement);

      return () => {
        styleElement.remove();
      };
    }, [cssText]);

    return {
      classes,
      cx: (...classNames: Array<string | false | null | undefined>) =>
        classNames.filter(Boolean).join(" "),
      theme,
    };
  };
