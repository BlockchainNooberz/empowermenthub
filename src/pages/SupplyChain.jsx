import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package, Search, ShieldCheck, Users, Factory, Plus } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/shared/StatCard";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import ProductCard from "@/components/supplychain/ProductCard";
import ProductDetailModal from "@/components/supplychain/ProductDetailModal";

export default function SupplyChain() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.SupplyChainProduct.list(),
  });

  const filtered = products.filter(p => {
    const matchesSearch = !search ||
      p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.manufacturer?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || p.verification_status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const verified = products.filter(p => p.verification_status === "verified").length;
  const totalJobs = products.reduce((s, p) => s + (p.jobs_supported || 0), 0);
  const avgDomestic = products.length > 0
    ? Math.round(products.reduce((s, p) => s + (p.domestic_content_pct || 0), 0) / products.length)
    : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeroBanner
        icon="🏭"
        eyebrow="Made in America"
        title="Supply Chain Transparency"
        subtitle="Track American-made products from raw materials to your hands. Support domestic manufacturing with verified data."
        tags={["Verified Products", "Domestic Content", "American Jobs"]}
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Verified Products" value={verified} icon={ShieldCheck} accentClass="bg-emerald-600/10 text-emerald-600" />
        <StatCard title="Jobs Supported" value={totalJobs} icon={Users} accentClass="bg-blue-600/10 text-blue-600" />
        <StatCard title="Avg Domestic Content" value={`${avgDomestic}%`} icon={Factory} accentClass="bg-amber-600/10 text-amber-600" />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products or manufacturers..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="textiles">Textiles</SelectItem>
            <SelectItem value="food_beverage">Food & Beverage</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Verification" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="bg-card border rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-muted rounded w-2/3 mb-3" />
              <div className="h-4 bg-muted rounded w-1/3 mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-heading font-bold">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ProductCard product={product} onClick={setSelectedProduct} />
            </motion.div>
          ))}
        </div>
      )}

      <ProductDetailModal product={selectedProduct} open={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}