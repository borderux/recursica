import React from "react";
import { Box, Flex, Typography, Grid } from "@recursica/ui-kit-mantine";
import TokenManager from "../../TokenManager";

const tokenManager = TokenManager.getInstance();
const colors = tokenManager.getThemeColors();
const colorScales = tokenManager.getColorScales();

const Swatches = () => {
  return (
    <>
      <Grid.Col span={2}>
        <Typography variant="h3" color="colors/neutral/050/on-tone">
          Colors
        </Typography>
      </Grid.Col>

      <Grid.Col span={10}>
        <Flex direction="row" gap="size/spacer/2x">
          <Flex gap="size/spacer/3x" wrap="wrap" py={20}>
            {colors.map((color) => (
              <Flex
                key={color.name}
                direction="column"
                justify="space-between"
                align="center"
                w={120}
              >
                <Typography
                  variant="h6"
                  color="colors/neutral/050/on-tone"
                  textAlign="center"
                >
                  {color.name.split("\n").map((line, index) => (
                    <React.Fragment key={line}>
                      {line}
                      {index < color.name.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Typography>
                <Box w={70} h={70} bg={color.color} opacity={color.opacity} />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Grid.Col>
    </>
  );
};

const OnColors = () => {
  // Define the order of variants (darkest to lightest)
  const variantOrder = [
    "900",
    "800",
    "700",
    "600",
    "500",
    "400",
    "300",
    "200",
    "100",
    "050",
  ];

  // Get the actual variants that exist for each scale
  const getOrderedVariants = (
    scale: Record<
      string,
      { subtle?: string; regular?: string; tone?: string; onTone?: string }
    >,
  ) => {
    const variants = Object.keys(scale).filter((key) => key !== "default");
    return variantOrder.filter((variant) => variants.includes(variant));
  };

  const getScaleDisplayName = (scaleName: string): string | string[] => {
    switch (scaleName) {
      case "neutral":
        return "Neutral";
      case "scale-1":
        return ["Scale 1", "(Primary)"];
      case "scale-2":
        return ["Scale 2", "(Secondary)"];
      default:
        return scaleName;
    }
  };

  const getDefaultVariant = (scaleName: string) => {
    switch (scaleName) {
      case "neutral":
        return "200";
      case "scale-1":
        return "400";
      case "scale-2":
        return "400";
      default:
        return "400";
    }
  };

  return (
    <>
      {Object.entries(colorScales).map(([scaleName, scale]) => {
        const orderedVariants = getOrderedVariants(scale);
        const defaultVariant = getDefaultVariant(scaleName);

        const title = getScaleDisplayName(scaleName);
        return (
          <React.Fragment key={scaleName}>
            <Grid.Col span={2}>
              <Flex h={40} justify="flex-end" align="center">
                <Typography
                  variant="h6"
                  color="colors/neutral/050/on-tone"
                  textAlign="right"
                >
                  {typeof title === "string" ? title : title.join("\n")}
                </Typography>
              </Flex>
              <Flex h={50} justify="flex-end" align="center">
                <Typography
                  variant="caption"
                  color="colors/neutral/050/on-tone"
                >
                  Regular
                </Typography>
              </Flex>
              <Flex h={50} justify="flex-end" align="center">
                <Typography
                  variant="caption"
                  color="colors/neutral/050/on-tone"
                >
                  Subtle
                </Typography>
              </Flex>
            </Grid.Col>

            {/* Color Swatches Row */}
            <Grid.Col span={10}>
              <Flex>
                {orderedVariants.map((variant) => {
                  const variantData = scale[variant];
                  if (!variantData) return null;

                  const isDefault = variant === defaultVariant;

                  return (
                    <Flex
                      direction="column"
                      align="center"
                      key={variant}
                      w={100}
                    >
                      <Flex h={40} align="center">
                        <Typography
                          variant="body-1/normal"
                          color="colors/neutral/050/on-tone"
                        >
                          {variant}
                        </Typography>
                      </Flex>
                      <Flex
                        w={100}
                        h={100}
                        bg={variantData.tone}
                        direction="column"
                        align="center"
                        justify="space-around"
                      >
                        <Flex flex={1} align="center" justify="center">
                          {/* Regular dot (upper) */}
                          {isDefault ? (
                            <Flex
                              w={40}
                              h={40}
                              br="size/border-radius/4x"
                              align="center"
                              justify="center"
                              bw={2}
                              bs="solid"
                              bc={variantData.onTone}
                            >
                              <Typography
                                variant="body-1/normal"
                                color={variantData.onTone}
                              >
                                D
                              </Typography>
                            </Flex>
                          ) : (
                            <Box
                              w={12}
                              h={12}
                              bg={variantData.onTone}
                              br="size/border-radius/4x"
                            />
                          )}
                        </Flex>

                        <Flex flex={1} align="center" justify="center">
                          {/* Subtle dot (lower) */}
                          <Box
                            w={12}
                            h={12}
                            bg={variantData.onTone}
                            br="size/border-radius/4x"
                            opacity={0.6}
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Grid.Col>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Colors = () => {
  return (
    <Box bg="colors/neutral/100/tone">
      <Grid>
        <Swatches />
        <OnColors />
      </Grid>
    </Box>
  );
};
