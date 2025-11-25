import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import DockerNetworkMap from "../docker-network-map"

describe("DockerNetworkMap", () => {
    it("renders networks and containers", () => {
        render(
            <DockerNetworkMap
                networks={[
                    { name: "bridge0", driver: "bridge", subnet: "172.18.0.0/16" },
                ]}
                containers={[
                    {
                        id: "abc123",
                        name: "backend",
                        status: "running",
                        networks: ["bridge0"],
                    },
                ]}
            />
        )

        expect(screen.getAllByText("bridge0").length).toBeGreaterThan(0)
        expect(screen.getByText("backend")).toBeInTheDocument()
    })

    it("shows loading state", () => {
        render(
            <DockerNetworkMap
                networks={[]}
                containers={[]}
                loading={true}
            />
        )

        expect(
            screen.getByText(/loading docker network data/i)
        ).toBeInTheDocument()
    })

    it("shows empty state when no networks/containers", () => {
        render(
            <DockerNetworkMap
                networks={[]}
                containers={[]}
            />
        )

        expect(
            screen.getByText(/no docker networks or containers found/i)
        ).toBeInTheDocument()
    })

    it("shows error message when error prop is provided", () => {
        render(
            <DockerNetworkMap
                networks={[]}
                containers={[]}
                error="Something went wrong"
            />
        )

        expect(
            screen.getByText(/something went wrong/i)
        ).toBeInTheDocument()
    })

    it("renders container and network without interaction errors", () => {
        render(
            <DockerNetworkMap
                networks={[
                    { name: "bridge0", driver: "bridge", subnet: "172.18.0.0/16" },
                ]}
                containers={[
                    {
                        id: "xyz987",
                        name: "api",
                        status: "running",
                        networks: ["bridge0"],
                    },
                ]}
            />
        )

        expect(screen.getByText("api")).toBeInTheDocument()
        expect(screen.getAllByText("bridge0").length).toBeGreaterThan(0)
    })
})
