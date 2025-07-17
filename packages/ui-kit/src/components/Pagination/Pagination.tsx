import {
  type PaginationProps as ManPaginationProps,
  Pagination as ManPagination,
} from "@mantine/core";
import { Flex } from "../Flex/Flex";
import { Button } from "../Button/Button";
import { usePagination } from "@mantine/hooks";
import { styles } from "./Pagination.css";

export type PaginationProps = Pick<ManPaginationProps, "total">;

export function Pagination(props: PaginationProps) {
  const paginationData = usePagination({ total: props.total });

  const handleNext = () => {
    paginationData.next();
  };

  const handlePrevious = () => {
    paginationData.previous();
  };

  return (
    <Flex>
      <Button
        label="Previous"
        onClick={handlePrevious}
        variant="text"
        size="small"
        icon="chevron_left_outline"
        disabled={paginationData.active === 1}
      />
      <ManPagination
        {...props}
        classNames={styles}
        withControls={false}
        value={paginationData.active}
        onChange={paginationData.setPage}
      />
      <Button
        label="Next"
        onClick={handleNext}
        variant="text"
        size="small"
        icon="chevron_right_outline"
        disabled={paginationData.active === props.total}
      />
    </Flex>
  );
}
