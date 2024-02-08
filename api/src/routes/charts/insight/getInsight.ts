import { z } from "zod";
import { dateInputRegex } from "../../../constants/regex";
import { protectedProcedure } from "../../../trpc";
import { assertProjectMember } from "../../../utils/assertProjectMember";
import { eventFilterSchema, metricSchema } from "./eventFilterSchema";
import { queryMetric } from "../../../utils/queryMetric";
import {
  ChartTimeRangeType,
  LineChartGroupByTimeType,
} from "../../../app-router-type";
import { getDateHeaders } from "../../../utils/getDateHeaders";

export type InsightData = { day: string; count: number };

export const getInsight = protectedProcedure
  .input(
    z.object({
      projectId: z.string(),
      from: z.string().regex(dateInputRegex).optional(),
      to: z.string().regex(dateInputRegex).optional(),
      lineChartGroupByTimeType: z
        .nativeEnum(LineChartGroupByTimeType)
        .optional(),
      timeRangeType: z.nativeEnum(ChartTimeRangeType),
      globalFilters: z.array(eventFilterSchema),
      breakdowns: z.array(eventFilterSchema).max(1),
      metrics: z.array(metricSchema),
    })
  )
  .query(
    async ({
      input: {
        projectId,
        from,
        to,
        metrics,
        breakdowns,
        timeRangeType,
        lineChartGroupByTimeType = LineChartGroupByTimeType.day,
        globalFilters,
      },
      ctx: { userId },
    }) => {
      await assertProjectMember({ projectId, userId });

      const { dateHeaders, dateMap } = getDateHeaders(
        timeRangeType,
        lineChartGroupByTimeType,
        from,
        to
      );

      return {
        dateHeaders,
        datas: (
          await Promise.all(
            metrics.map((x) =>
              queryMetric({
                dateMap,
                dateHeaders,
                projectId,
                from,
                to,
                metric: x,
                globalFilters,
                breakdowns,
                timeRangeType,
                lineChartGroupByTimeType,
              })
            )
          )
        ).flat(),
      };
    }
  );
