const express = require("express");
const { getJson } = require("serpapi");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();
require("dotenv").config();

router.post(
  "/flights",
  asyncHandler(async (req, res) => {
    const { arrival_id, outbound_date, return_date, departure_id } = req.body;

    const json = await getJson({
      engine: "google_flights",
      departure_id,
      arrival_id,
      outbound_date,
      return_date,
      currency: "INR",
      hl: "en",
      api_key: process.env.SERP_API_KEY,
    });
    res.status(200).send(json);
  })
);

router.post(
  "/trains",
  asyncHandler(async (req, res) => {
    const { from, to, date } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({
        message: "from, to and date are required",
      });
    }

    const query = `${from} to ${to} train ${date}`;

    const json = await getJson({
      engine: "google",
      q: query,
      hl: "en",
      gl: "in",
      api_key: process.env.SERP_API_KEY,
    });

    const trains = (json.organic_results || []).map(item => ({
      title: item.title,
      snippet: item.snippet,
      source: item.source,
      link: item.link,
    }));

    res.status(200).json({
      query: json.search_information?.query_displayed,
      trains,
    });
  })
);

router.get(
  "/trainfare",
  asyncHandler(async (req, res) => {
    const { trainno, from, to, date } = req.query;

    if (!trainno || !from || !to || !date) {
      return res.status(400).json({
        message: "trainno, from, to and date are required",
      });
    }

    const query = `${trainno} train fare ${from} to ${to} ${date}`;

    const searchResult = await getJson({
      engine: "google",
      q: query,
      hl: "en",
      gl: "in",
      api_key: process.env.SERP_API_KEY,
    });

    if (searchResult?.ai_overview?.text_blocks?.length > 0) {
      return res.status(200).json({
        trainno,
        route: `${from} → ${to}`,
        date,
        source: "google_ai_overview",
        fareInfo: searchResult.ai_overview.text_blocks,
      });
    }

    if (searchResult?.related_questions?.length > 0) {
      const extractedFare = searchResult.related_questions
        .flatMap(q => q.text_blocks || [])
        .filter(b => b.snippet);

      if (extractedFare.length > 0) {
        return res.status(200).json({
          trainno,
          route: `${from} → ${to}`,
          date,
          source: "google_related_questions",
          fareInfo: extractedFare,
        });
      }
    }

    if (searchResult?.organic_results?.length > 0) {
      const organicFare = searchResult.organic_results
        .map(r => r.snippet)
        .filter(Boolean);

      return res.status(200).json({
        trainno,
        route: `${from} → ${to}`,
        date,
        source: "google_organic_results",
        fareInfo: organicFare,
      });
    }

    return res.status(404).json({
      message: "Train fare information not found",
    });
  })
);

router.post(
  "/hotels",
  asyncHandler(async (req, res) => {
    const { q, check_in_date, check_out_date, adults } = req.body;

    const json = await getJson({
      engine: "google_hotels",
      q,
      check_in_date,
      check_out_date,
      adults,
      currency: "INR",
      gl: "us",
      hl: "en",
      api_key: process.env.SERP_API_KEY,
    });
    res.status(200).send(json);
  })
);

router.post(
  "/localplaces",
  asyncHandler(async (req, res) => {
    const { q, location } = req.body;

    const json = await getJson({
      engine: "google_local",
      q,
      location,
      api_key: process.env.SERP_API_KEY,
    });
    res.status(200).send(json);
  })
);

router.get(
  "/maps",
  asyncHandler(async (req, res) => {
    const { start_addr, end_addr } = req.query;

    const json = await getJson({
      engine: "google_maps_directions",
      start_addr,
      end_addr,
      api_key: process.env.SERP_API_KEY,
    });
    res.status(200).send(json);
  })
);

module.exports = router;