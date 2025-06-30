"use client"

import { Check, ChevronDown, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mockBranches } from "@/lib/mock-data"

interface BranchSelectorProps {
  selectedBranch: string
  onBranchChange: (branchId: string) => void
  showCombined?: boolean
}

export function BranchSelector({ selectedBranch, onBranchChange, showCombined = false }: BranchSelectorProps) {
  const getBranchName = (branchId: string) => {
    if (branchId === "combined") return "Combined Balance"
    const branch = mockBranches.find((b) => b.id === branchId)
    return branch?.name || "Select Branch"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Building2 className="h-4 w-4" />
          {getBranchName(selectedBranch)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {showCombined && (
          <DropdownMenuItem onClick={() => onBranchChange("combined")}>
            <div className="flex items-center justify-between w-full">
              <span>Combined Balance</span>
              {selectedBranch === "combined" && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        )}
        {mockBranches.map((branch) => (
          <DropdownMenuItem key={branch.id} onClick={() => onBranchChange(branch.id)}>
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">{branch.name}</div>
                <div className="text-xs text-muted-foreground">{branch.location}</div>
              </div>
              {selectedBranch === branch.id && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
